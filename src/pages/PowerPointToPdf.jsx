import { useState } from 'react'
import JSZip from 'jszip'
import { jsPDF } from 'jspdf'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import { Download } from 'lucide-react'
import ToolPageLayout from '../components/shared/ToolPageLayout'
import UploadZone, { ErrorBanner } from '../components/shared/UploadZone'
import ProgressBar from '../components/shared/ProgressBar'
import Button from '../components/shared/Button'
import Panel from '../components/shared/Panel'
import { formatFileSize, validateFile } from '../utils/pdfHelpers'

export default function PowerPointToPdf() {
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const handleFile = (files) => {
    setError(null)
    setResult(null)
    const f = files[0]
    
    if (!f.name.toLowerCase().endsWith('.pptx')) {
      setError('Invalid file type. Expected: .pptx')
      toast.error('Invalid file type')
      return
    }
    
    const err = validateFile(f)
    if (err) {
      setError(err)
      toast.error(err)
      return
    }
    setFile(f)
  }

  const convert = async () => {
    if (!file) return
    setProcessing(true)
    setProgress(0)
    setResult(null)
    
    try {
      const arrayBuffer = await file.arrayBuffer()
      const zip = await JSZip.loadAsync(arrayBuffer)
      
      const slideFiles = Object.keys(zip.files)
        .filter(path => path.match(/^ppt\/slides\/slide\d+\.xml$/))
        .sort((a, b) => {
          const numA = parseInt(a.match(/slide(\d+)\.xml/)[1])
          const numB = parseInt(b.match(/slide(\d+)\.xml/)[1])
          return numA - numB
        })
        
      if (slideFiles.length === 0) {
        throw new Error('No slides found in this presentation.')
      }
      
      const pdf = new jsPDF('l', 'pt', [960, 540])
      const parser = new DOMParser()
      
      for (let i = 0; i < slideFiles.length; i++) {
        setProgress(Math.round((i / slideFiles.length) * 80))
        const slidePath = slideFiles[i]
        const slideNum = slidePath.match(/slide(\d+)\.xml/)[1]
        
        const slideXml = await zip.file(slidePath).async('text')
        const xmlDoc = parser.parseFromString(slideXml, 'text/xml')
        
        // Extract texts
        const textNodes = Array.from(xmlDoc.getElementsByTagName('a:t'))
        const texts = textNodes.map(n => n.textContent).filter(t => t.trim().length > 0)
        
        // Extract images
        const images = []
        const relsPath = `ppt/slides/_rels/slide${slideNum}.xml.rels`
        if (zip.file(relsPath)) {
          const relsXml = await zip.file(relsPath).async('text')
          const relsDoc = parser.parseFromString(relsXml, 'text/xml')
          const rels = Array.from(relsDoc.getElementsByTagName('Relationship'))
          
          for (const rel of rels) {
            const target = rel.getAttribute('Target')
            if (target && target.includes('media/')) {
               const mediaPath = target.replace('../', 'ppt/')
               if (zip.file(mediaPath)) {
                 const blob = await zip.file(mediaPath).async('blob')
                 const url = URL.createObjectURL(blob)
                 
                 // load image to get dimensions
                 const img = new Image()
                 await new Promise((resolve) => {
                   img.onload = resolve
                   img.onerror = resolve
                   img.src = url
                 })
                 images.push(img)
               }
            }
          }
        }
        
        // Render to canvas
        const canvas = document.createElement('canvas')
        canvas.width = 960
        canvas.height = 540
        const ctx = canvas.getContext('2d')
        
        // Background
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Draw Text
        ctx.fillStyle = '#333333'
        let y = 60
        for (let j = 0; j < texts.length; j++) {
          const text = texts[j]
          if (j === 0) {
            // Assume first text is title
            ctx.font = 'bold 36px sans-serif'
          } else {
            ctx.font = '24px sans-serif'
          }
          
          // Basic text wrapping
          const words = text.split(' ')
          let line = ''
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' '
            const metrics = ctx.measureText(testLine)
            if (metrics.width > 840 && n > 0) {
              ctx.fillText(line, 60, y)
              line = words[n] + ' '
              y += (j === 0 ? 45 : 30)
            } else {
              line = testLine
            }
          }
          ctx.fillText(line, 60, y)
          y += (j === 0 ? 60 : 35)
          
          if (y > 350) break // leave room for images
        }
        
        // Draw Images
        if (images.length > 0) {
          const imgY = Math.max(y, 200)
          const availableHeight = 500 - imgY
          const availableWidth = 840
          
          // very basic image layout (just placing them side by side)
          let imgX = 60
          for (const img of images) {
             if (img.width > 0) {
               const ratio = Math.min(availableWidth / img.width, availableHeight / img.height, 1)
               const drawW = img.width * ratio
               const drawH = img.height * ratio
               
               if (imgX + drawW > 900) break // run out of horizontal space
               
               ctx.drawImage(img, imgX, imgY, drawW, drawH)
               imgX += drawW + 20
             }
          }
        }
        
        const imgData = canvas.toDataURL('image/jpeg', 0.9)
        if (i > 0) pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, 0, 960, 540)
      }
      
      setProgress(95)
      const blob = pdf.output('blob')
      setProgress(100)
      
      setResult({
        blob,
        name: file.name.replace(/\.pptx$/i, '.pdf')
      })
      toast.success('Conversion complete!')
    } catch (e) {
      toast.error(e.message || 'Failed to convert PowerPoint to PDF')
      console.error(e)
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      saveAs(result.blob, result.name)
    }
  }

  return (
    <ToolPageLayout
      title="PowerPoint to PDF"
      description="Convert your .pptx slides to PDF documents. Basic conversion — extracts text and images into a simplified layout."
    >
      {!file ? (
        <UploadZone
          onFiles={handleFile}
          accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          label="Drop your PowerPoint file here"
          sublabel=".pptx files only"
        />
      ) : (
        <div className="space-y-6">
          <div className="rounded-md border-2 border-black bg-brand-yellow px-4 py-3 text-sm font-semibold text-ink shadow-hard-sm">
            Note: Slide layout and formatting will be simplified — best for text/content extraction, not pixel-perfect design.
          </div>
        
          <Panel title="+--- FILE INFO ---+">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-ink">{file.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-brand-charcoal/70">
                  {formatFileSize(file.size)}
                </p>
                {!processing && !result && (
                  <button
                    onClick={() => {
                      setFile(null)
                    }}
                    className="mt-3 rounded-md border-2 border-black bg-ui px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-ink shadow-hard-sm transition duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-none"
                  >
                    choose a different file
                  </button>
                )}
              </div>
            </div>
          </Panel>

          {processing && <ProgressBar progress={progress} label="Converting presentation..." />}

          {!result ? (
            <Button onClick={convert} disabled={processing} variant="primary">
              <Download className="h-4 w-4" />
              {processing ? 'Converting...' : '[ CONVERT TO PDF ]'}
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button onClick={handleDownload} variant="primary" className="flex-1">
                <Download className="h-4 w-4" />
                [ DOWNLOAD PDF ]
              </Button>
              <button
                onClick={() => {
                  setFile(null)
                  setResult(null)
                  setProgress(0)
                }}
                className="rounded-md border-2 border-black bg-ui px-6 py-3 font-heading font-bold tracking-[0.25em] text-ink uppercase shadow-hard-sm transition duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-md"
              >
                Start Over
              </button>
            </div>
          )}
        </div>
      )}

      <ErrorBanner message={error} />
    </ToolPageLayout>
  )
}
