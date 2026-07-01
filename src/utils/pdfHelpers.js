import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

export { pdfjsLib }

export async function loadPdfDocument(file) {
  const arrayBuffer = await file.arrayBuffer()
  return pdfjsLib.getDocument({ data: arrayBuffer }).promise
}

export async function renderPageToCanvas(pdfDoc, pageNum, scale = 1.5) {
  const page = await pdfDoc.getPage(pageNum)
  const viewport = page.getViewport({ scale })
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.width = viewport.width
  canvas.height = viewport.height
  await page.render({ canvasContext: context, viewport }).promise
  return { canvas, viewport, page }
}

export async function getPdfPageCount(file) {
  const doc = await loadPdfDocument(file)
  const count = doc.numPages
  doc.destroy()
  return count
}

export function canvasToBlob(canvas, type = 'image/jpeg', quality = 0.92) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality)
  })
}

export function canvasToDataUrl(canvas, type = 'image/png') {
  return canvas.toDataURL(type)
}

export async function dataUrlToBytes(dataUrl) {
  const res = await fetch(dataUrl)
  return new Uint8Array(await res.arrayBuffer())
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

const EXT_MAP = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
}

export function validateFile(file, { types = [], maxSize = MAX_FILE_SIZE } = {}) {
  if (!file) return 'No file selected.'
  if (maxSize && file.size > maxSize) {
    return `File too large (${formatFileSize(file.size)}). Max size is ${formatFileSize(maxSize)}.`
  }
  if (types.length) {
    const name = file.name.toLowerCase()
    const valid = types.some((t) => {
      if (file.type === t) return true
      const exts = EXT_MAP[t] || []
      return exts.some((ext) => name.endsWith(ext))
    })
    if (!valid) {
      const ext = types.map((t) => t.split('/')[1]).join(', ')
      return `Invalid file type. Expected: ${ext}`
    }
  }
  return null
}

export function generateVerificationHash() {
  const timestamp = new Date().toISOString()
  const random = crypto.randomUUID()
  const raw = `${timestamp}-${random}`
  let hash = 0
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i)
    hash |= 0
  }
  return `PK-${Math.abs(hash).toString(16).toUpperCase().slice(0, 8)}`
}
