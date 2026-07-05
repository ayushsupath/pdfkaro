import { useState, useCallback } from 'react'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import { Download } from 'lucide-react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import mammoth from 'mammoth'
import ToolPageLayout from '../components/shared/ToolPageLayout'
import UploadZone, { ErrorBanner } from '../components/shared/UploadZone'
import ProgressBar from '../components/shared/ProgressBar'
import Button from '../components/shared/Button'
import Panel from '../components/shared/Panel'
import { validateFile } from '../utils/pdfHelpers'

export default function WordToPdf() {
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const handleFile = useCallback(async (files) => {
    setError(null)
    const selected = files[0]
    const err = validateFile(selected, {
      types: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    })
    if (err) {
      setError(err)
      toast.error(err)
      return
    }

    setFile(selected)
  }, [])

  const convert = async () => {
    if (!file) {
      toast.error('Please add a Word document')
      return
    }

    setProcessing(true)
    setProgress(5)
    setError(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      setProgress(20)

      const result = await mammoth.convertToHtml({ arrayBuffer })
      const html = result.value || ''
      if (!html.trim()) {
        throw new Error('No readable content found in the document.')
      }

      setProgress(35)
      const hidden = document.createElement('div')
      hidden.style.position = 'absolute'
      hidden.style.left = '-9999px'
      hidden.style.top = '0'
      hidden.style.width = '794px'
      hidden.style.padding = '24px'
      hidden.style.backgroundColor = '#ffffff'
      hidden.style.color = '#000000'
      hidden.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
      hidden.style.lineHeight = '1.5'
      hidden.style.wordWrap = 'break-word'
      hidden.style.boxSizing = 'border-box'
      hidden.innerHTML = `<div>${html}</div>`
      document.body.appendChild(hidden)

      try {
        const canvas = await html2canvas(hidden, {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
          logging: false,
        })

        setProgress(55)
        const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const canvasWidth = canvas.width
        const canvasHeight = canvas.height
        const pdfPageHeightPx = Math.floor((pageHeight * canvasWidth) / pageWidth)
        const pageCount = Math.ceil(canvasHeight / pdfPageHeightPx)

        let y = 0
        let pageNumber = 0
        while (y < canvasHeight) {
          const sliceHeight = Math.min(pdfPageHeightPx, canvasHeight - y)
          const pageCanvas = document.createElement('canvas')
          pageCanvas.width = canvasWidth
          pageCanvas.height = sliceHeight
          const pageContext = pageCanvas.getContext('2d')
          pageContext.drawImage(canvas, 0, y, canvasWidth, sliceHeight, 0, 0, canvasWidth, sliceHeight)

          const imgData = pageCanvas.toDataURL('image/png')
          const sliceHeightPt = (sliceHeight * pageWidth) / canvasWidth

          if (pageNumber > 0) pdf.addPage()
          pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, sliceHeightPt)

          pageNumber += 1
          y += sliceHeight
          setProgress(55 + Math.round((pageNumber / pageCount) * 35))
        }

        const blob = pdf.output('blob')
        const downloadName = file.name.replace(/\.docx$/i, '.pdf')
        saveAs(blob, downloadName)
        toast.success('PDF downloaded!')
      } finally {
        document.body.removeChild(hidden)
      }
    } catch (err) {
      const message = err?.message || 'Conversion failed. The file may be corrupted.'
      setError(message)
      toast.error(message)
    } finally {
      setProcessing(false)
      setProgress(0)
    }
  }

  return (
    <ToolPageLayout
      title="Word to PDF"
      description="Convert Word documents to PDF, right in your browser. Basic formatting is preserved where possible."
    >
      {!file ? (
        <UploadZone
          onFiles={handleFile}
          accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          label="Drop a DOCX file here"
          sublabel="Word document only"
        />
      ) : (
        <Panel title="+--- FILE INFO ---+">
          <p className="text-sm text-primary">{file.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted">Word document</p>
          <button
            onClick={() => {
              setFile(null)
              setError(null)
            }}
            className="mt-3 border border-border px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-muted transition-colors hover:border-primary hover:text-primary"
          >
            choose a different file
          </button>
        </Panel>
      )}

      <div className="rounded-sm border border-border bg-black/70 p-4 text-sm text-primary/80">
        <p className="uppercase tracking-[0.25em] text-muted">[note]</p>
        <p className="mt-2">Basic conversion — formatting may vary slightly from the original Word document.</p>
      </div>

      {processing && <ProgressBar progress={progress} label="Converting document..." />}

      <Button onClick={convert} disabled={processing} variant="primary">
        <Download className="h-4 w-4" />
        {processing ? 'Converting...' : '[ DOWNLOAD PDF ]'}
      </Button>

      <ErrorBanner message={error} />
    </ToolPageLayout>
  )
}
