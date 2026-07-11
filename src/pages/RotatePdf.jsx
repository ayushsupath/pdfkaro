import { useState } from 'react'
import { PDFDocument, degrees } from 'pdf-lib'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import { Download, RotateCcw, RotateCw } from 'lucide-react'
import ToolPageLayout from '../components/shared/ToolPageLayout'
import UploadZone, { ErrorBanner } from '../components/shared/UploadZone'
import ProgressBar from '../components/shared/ProgressBar'
import Button from '../components/shared/Button'
import Panel from '../components/shared/Panel'
import { loadPdfDocument, renderPageToCanvas, canvasToDataUrl, validateFile } from '../utils/pdfHelpers'

export default function RotatePdf() {
  const [file, setFile] = useState(null)
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleFile = async (files) => {
    setError(null)
    const f = files[0]
    const err = validateFile(f, { types: ['application/pdf'] })
    if (err) {
      setError(err)
      toast.error(err)
      return
    }
    
    setFile(f)
    setLoading(true)
    try {
      const doc = await loadPdfDocument(f)
      const numPages = doc.numPages
      const pageData = []
      
      for (let i = 1; i <= numPages; i++) {
        const { canvas } = await renderPageToCanvas(doc, i, 0.5)
        const url = canvasToDataUrl(canvas)
        pageData.push({ id: i, url, rotation: 0 })
      }
      
      setPages(pageData)
      doc.destroy()
    } catch (e) {
      setError('Could not read PDF. The file may be corrupted or password-protected.')
      toast.error('Could not read PDF')
      setFile(null)
    } finally {
      setLoading(false)
    }
  }

  const rotateAll = (direction) => {
    const angle = direction === 'cw' ? 90 : -90
    setPages(pages.map(p => ({ ...p, rotation: (p.rotation + angle + 360) % 360 })))
  }

  const rotatePage = (id, direction) => {
    const angle = direction === 'cw' ? 90 : -90
    setPages(pages.map(p => p.id === id ? { ...p, rotation: (p.rotation + angle + 360) % 360 } : p))
  }

  const handleDownload = async () => {
    if (!file || pages.length === 0) return
    setProcessing(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const pdfPages = pdfDoc.getPages()
      
      pages.forEach((p, idx) => {
        if (p.rotation !== 0) {
          const currentRotation = pdfPages[idx].getRotation().angle
          const newRotation = (currentRotation + p.rotation) % 360
          pdfPages[idx].setRotation(degrees(newRotation))
        }
      })
      
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const newName = file.name.replace(/\.pdf$/i, '-rotated.pdf')
      saveAs(blob, newName)
      toast.success('PDF rotated and downloaded!')
    } catch (e) {
      toast.error('Failed to rotate PDF')
      console.error(e)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <ToolPageLayout
      title="Rotate PDF"
      description="Rotate individual PDF pages or all pages at once. Processing happens locally in your browser."
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-ink">{file.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-brand-charcoal/70">{pages.length} page{pages.length !== 1 ? 's' : ''}</p>
                <button
                  onClick={() => {
                    setFile(null)
                    setPages([])
                  }}
                  className="mt-3 rounded-md border-2 border-black bg-ui px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-ink shadow-hard-sm transition duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-none"
                >
                  choose a different file
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest mr-2">Rotate All:</span>
                <button
                  onClick={() => rotateAll('ccw')}
                  className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-black bg-ui shadow-hard-sm transition hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-md active:translate-x-0 active:translate-y-0 active:shadow-hard-none"
                  title="Rotate All Left"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
                <button
                  onClick={() => rotateAll('cw')}
                  className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-black bg-ui shadow-hard-sm transition hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-md active:translate-x-0 active:translate-y-0 active:shadow-hard-none"
                  title="Rotate All Right"
                >
                  <RotateCw className="h-5 w-5" />
                </button>
              </div>
            </div>
          </Panel>

          {loading ? (
            <div className="py-12 text-center text-sm font-bold uppercase tracking-widest text-brand-charcoal animate-pulse">
              Loading thumbnails...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {pages.map((p) => (
                <div key={p.id} className="group relative flex flex-col items-center rounded-xl border-2 border-black bg-ui p-2 shadow-hard-sm">
                  <div className="relative mb-2 flex h-40 w-full items-center justify-center overflow-hidden bg-brand-charcoal/5 rounded-md border border-black/10">
                    <img 
                      src={p.url} 
                      alt={`Page ${p.id}`} 
                      className="max-h-full max-w-full object-contain transition-transform duration-300"
                      style={{ transform: `rotate(${p.rotation}deg)` }}
                    />
                  </div>
                  <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-brand-charcoal">Page {p.id}</span>
                  <div className="flex w-full justify-between gap-1">
                    <button
                      onClick={() => rotatePage(p.id, 'ccw')}
                      className="flex flex-1 items-center justify-center rounded-md border-2 border-black bg-brand-yellow py-1.5 shadow-hard-sm transition hover:-translate-y-0.5 hover:shadow-hard-md active:translate-y-0 active:shadow-hard-none"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => rotatePage(p.id, 'cw')}
                      className="flex flex-1 items-center justify-center rounded-md border-2 border-black bg-brand-sage py-1.5 shadow-hard-sm transition hover:-translate-y-0.5 hover:shadow-hard-md active:translate-y-0 active:shadow-hard-none"
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {processing && <ProgressBar progress={100} label="Applying rotations..." />}

          <Button onClick={handleDownload} disabled={processing || loading || pages.length === 0} variant="primary">
            <Download className="h-4 w-4" />
            {processing ? 'Processing...' : '[ DOWNLOAD PDF ]'}
          </Button>
        </div>
      )}

      <ErrorBanner message={error} />
    </ToolPageLayout>
  )
}
