import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import { Download } from 'lucide-react'
import ToolPageLayout from '../components/shared/ToolPageLayout'
import UploadZone, { ErrorBanner } from '../components/shared/UploadZone'
import ProgressBar from '../components/shared/ProgressBar'
import Button from '../components/shared/Button'
import Panel from '../components/shared/Panel'
import { loadPdfDocument, renderPageToCanvas, canvasToDataUrl, dataUrlToBytes, formatFileSize, validateFile } from '../utils/pdfHelpers'

const COMPRESSION_LEVELS = {
  low: { label: 'Low Compression (High Quality)', scale: 2.0, quality: 0.8 },
  medium: { label: 'Medium Compression (Good Quality)', scale: 1.5, quality: 0.6 },
  high: { label: 'High Compression (Lower Quality)', scale: 1.0, quality: 0.4 },
}

export default function CompressPdf() {
  const [file, setFile] = useState(null)
  const [level, setLevel] = useState('medium')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const handleFile = (files) => {
    setError(null)
    setResult(null)
    const f = files[0]
    const err = validateFile(f, { types: ['application/pdf'] })
    if (err) {
      setError(err)
      toast.error(err)
      return
    }
    setFile(f)
  }

  const compress = async () => {
    if (!file) return
    setProcessing(true)
    setProgress(0)
    setResult(null)
    
    try {
      const doc = await loadPdfDocument(file)
      const numPages = doc.numPages
      const { scale, quality } = COMPRESSION_LEVELS[level]
      
      const newPdf = await PDFDocument.create()
      
      for (let i = 1; i <= numPages; i++) {
        setProgress(Math.round(((i - 1) / numPages) * 50)) // 50% for rendering
        const { canvas, viewport } = await renderPageToCanvas(doc, i, scale)
        const dataUrl = canvasToDataUrl(canvas, 'image/jpeg', quality)
        const imgBytes = await dataUrlToBytes(dataUrl)
        
        const image = await newPdf.embedJpg(imgBytes)
        // create page with original viewport dimensions (unscaled)
        const originalViewport = (await doc.getPage(i)).getViewport({ scale: 1.0 })
        const page = newPdf.addPage([originalViewport.width, originalViewport.height])
        
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: originalViewport.width,
          height: originalViewport.height,
        })
      }
      
      doc.destroy()
      setProgress(75) // 75% for saving
      
      const pdfBytes = await newPdf.save()
      setProgress(100)
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      setResult({
        blob,
        originalSize: file.size,
        newSize: blob.size,
        name: file.name.replace(/\.pdf$/i, '-compressed.pdf')
      })
      toast.success('PDF compressed successfully!')
    } catch (e) {
      toast.error('Failed to compress PDF')
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
      title="Compress PDF"
      description="Reduce PDF file size by compressing images and discarding invisible text layers. Perfect for email attachments."
    >
      {!file ? (
        <UploadZone
          onFiles={handleFile}
          accept="application/pdf"
          label="Drop your PDF here"
          sublabel="PDF files only"
        />
      ) : (
        <div className="space-y-6">
          <Panel title="+--- FILE INFO ---+">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-ink">{file.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-brand-charcoal/70">Size: {formatFileSize(file.size)}</p>
                {!processing && !result && (
                  <button
                    onClick={() => setFile(null)}
                    className="mt-3 rounded-md border-2 border-black bg-ui px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-ink shadow-hard-sm transition duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-none"
                  >
                    choose a different file
                  </button>
                )}
              </div>
              
              {result && (
                <div className="text-right">
                  <p className="text-xs uppercase font-bold tracking-widest text-brand-sage">Result</p>
                  <p className="mt-1 text-xl font-heading font-black">{formatFileSize(result.newSize)}</p>
                  <p className="text-[10px] uppercase tracking-widest text-brand-charcoal/70 mt-1">
                    Reduced by {Math.round((1 - result.newSize / result.originalSize) * 100)}%
                  </p>
                </div>
              )}
            </div>
          </Panel>

          {!result && (
            <Panel title="+--- COMPRESSION LEVEL ---+">
              <div className="flex flex-col gap-3 sm:flex-row">
                {Object.entries(COMPRESSION_LEVELS).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => setLevel(key)}
                    disabled={processing}
                    className={`flex-1 rounded-md border-2 border-black px-4 py-3 text-xs uppercase tracking-[0.2em] font-bold transition duration-200 ${
                      level === key
                        ? 'bg-ink text-ui shadow-hard-sm'
                        : 'bg-ui text-ink shadow-hard-none hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-sm'
                    } disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-hard-none`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Panel>
          )}

          {processing && <ProgressBar progress={progress} label="Compressing PDF..." />}

          {!result ? (
            <Button onClick={compress} disabled={processing} variant="primary">
              <Download className="h-4 w-4" />
              {processing ? 'Compressing...' : '[ COMPRESS PDF ]'}
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button onClick={handleDownload} variant="primary" className="flex-1">
                <Download className="h-4 w-4" />
                [ DOWNLOAD COMPRESSED PDF ]
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
