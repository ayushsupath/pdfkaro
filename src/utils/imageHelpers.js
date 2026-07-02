import { jsPDF } from 'jspdf'
import imageCompression from 'browser-image-compression'
import { PDFDocument } from 'pdf-lib'
import { loadPdfDocument, renderPageToCanvas, canvasToBlob } from './pdfHelpers'

export async function compressImage(file, maxSizeMB = 2) {
  if (file.size <= maxSizeMB * 1024 * 1024) return file
  try {
    return await imageCompression(file, {
      maxSizeMB,
      maxWidthOrHeight: 4096,
      useWebWorker: true,
    })
  } catch {
    return file
  }
}

export async function imagesToPdf(imageFiles, onProgress) {
  if (!imageFiles.length) throw new Error('No images provided')

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20

  for (let i = 0; i < imageFiles.length; i++) {
    onProgress?.(((i + 1) / imageFiles.length) * 100)
    const file = await compressImage(imageFiles[i].file || imageFiles[i])
    const dataUrl = await readFileAsDataUrl(file)

    const img = await loadImage(dataUrl)
    const ratio = Math.min(
      (pageWidth - margin * 2) / img.width,
      (pageHeight - margin * 2) / img.height
    )
    const w = img.width * ratio
    const h = img.height * ratio
    const x = (pageWidth - w) / 2
    const y = (pageHeight - h) / 2

    if (i > 0) pdf.addPage()
    const format = file.type === 'image/png' ? 'PNG' : 'JPEG'
    pdf.addImage(dataUrl, format, x, y, w, h)
  }

  return pdf.output('blob')
}

export async function mergePdfs(files, onProgress) {
  const merged = await PDFDocument.create()

  for (let i = 0; i < files.length; i++) {
    onProgress?.(((i + 1) / files.length) * 100)
    const bytes = await files[i].arrayBuffer()
    const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true })
    const pages = await merged.copyPages(pdf, pdf.getPageIndices())
    pages.forEach((page) => merged.addPage(page))
  }

  const pdfBytes = await merged.save()
  return new Blob([pdfBytes], { type: 'application/pdf' })
}

export async function splitPdf(file, mode, pageRanges, onProgress) {
  const bytes = await file.arrayBuffer()
  const source = await PDFDocument.load(bytes, { ignoreEncryption: true })
  const totalPages = source.getPageCount()
  const results = []

  if (mode === 'all') {
    for (let i = 0; i < totalPages; i++) {
      onProgress?.(((i + 1) / totalPages) * 100)
      const newPdf = await PDFDocument.create()
      const [page] = await newPdf.copyPages(source, [i])
      newPdf.addPage(page)
      const pdfBytes = await newPdf.save()
      results.push({
        name: `page-${i + 1}.pdf`,
        blob: new Blob([pdfBytes], { type: 'application/pdf' }),
      })
    }
  } else if (mode === 'extract') {
    const newPdf = await PDFDocument.create()
    const indices = pageRanges
      .split(',')
      .flatMap((part) => {
        part = part.trim()
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(Number)
          return Array.from({ length: end - start + 1 }, (_, j) => start - 1 + j)
        }
        return [Number(part) - 1]
      })
      .filter((i) => i >= 0 && i < totalPages)

    const pages = await newPdf.copyPages(source, indices)
    pages.forEach((page) => newPdf.addPage(page))
    const pdfBytes = await newPdf.save()
    results.push({
      name: 'extracted.pdf',
      blob: new Blob([pdfBytes], { type: 'application/pdf' }),
    })
    onProgress?.(100)
  }

  return results
}

export async function embedSignatureOnPdf(pdfFile, placements, qrDataUrl) {
  const bytes = await pdfFile.arrayBuffer()
  const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true })
  const pages = pdfDoc.getPages()

  for (const placement of placements) {
    const page = pages[placement.pageIndex]
    if (!page) continue

    const { width: pageWidth, height: pageHeight } = page.getSize()
    const imgBytes = await dataUrlToBytes(placement.imageDataUrl)
    let image
    if (placement.imageDataUrl.includes('image/png')) {
      image = await pdfDoc.embedPng(imgBytes)
    } else {
      image = await pdfDoc.embedJpg(imgBytes)
    }

    const imgWidth = placement.widthRatio * pageWidth
    const imgHeight = (image.height / image.width) * imgWidth
    const x = placement.xRatio * pageWidth
    const y = pageHeight - placement.yRatio * pageHeight - imgHeight

    page.drawImage(image, { x, y, width: imgWidth, height: imgHeight })
  }

  if (qrDataUrl && pages.length > 0) {
    const qrBytes = await dataUrlToBytes(qrDataUrl)
    const qrImage = await pdfDoc.embedPng(qrBytes)
    const lastPage = pages[pages.length - 1]
    const { width: pw, height: ph } = lastPage.getSize()
    const qrSize = 40
    lastPage.drawImage(qrImage, { x: pw - qrSize - 10, y: 10, width: qrSize, height: qrSize })
  }

  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes], { type: 'application/pdf' })
}

export async function embedSignatureOnImage(imageFile, placements, qrDataUrl) {
  const src = URL.createObjectURL(imageFile)
  const img = await loadImage(src)

  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')

  // Draw base image
  ctx.drawImage(img, 0, 0)

  // Draw placements
  for (const placement of placements) {
    if (placement.pageIndex !== 0) continue
    const pImg = await loadImage(placement.imageDataUrl)
    const imgWidth = placement.widthRatio * canvas.width
    const imgHeight = (pImg.height / pImg.width) * imgWidth
    const x = placement.xRatio * canvas.width
    const y = placement.yRatio * canvas.height
    
    ctx.drawImage(pImg, x, y, imgWidth, imgHeight)
  }

  // Draw QR code
  if (qrDataUrl) {
    const qrImg = await loadImage(qrDataUrl)
    const qrSize = 40
    // Using same bottom-right offset logic as PDF
    ctx.drawImage(
      qrImg,
      canvas.width - qrSize - 10,
      canvas.height - qrSize - 10,
      qrSize,
      qrSize
    )
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    }, imageFile.type, 0.95) // Use original image format
  })
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

async function dataUrlToBytes(dataUrl) {
  const res = await fetch(dataUrl)
  return new Uint8Array(await res.arrayBuffer())
}

export function removeWhiteBackground(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        if (r > 230 && g > 230 && b > 230) {
          data[i + 3] = 0
        }
      }
      ctx.putImageData(imageData, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.src = dataUrl
  })
}

export async function pdfPagesToImages(pdfFile, format = 'jpeg', onProgress) {
  const doc = await loadPdfDocument(pdfFile)
  const images = []

  for (let i = 1; i <= doc.numPages; i++) {
    onProgress?.((i / doc.numPages) * 100)
    const { canvas } = await renderPageToCanvas(doc, i, 2)
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg'
    const ext = format === 'png' ? 'png' : 'jpg'
    const blob = await canvasToBlob(canvas, mimeType, 0.92)
    images.push({ name: `page-${i}.${ext}`, blob })
  }

  doc.destroy()
  return images
}
