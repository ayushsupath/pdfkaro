import { useState } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import { Download } from 'lucide-react'
import ToolPageLayout from '../components/shared/ToolPageLayout'
import UploadZone, { ErrorBanner } from '../components/shared/UploadZone'
import ProgressBar from '../components/shared/ProgressBar'
import Button from '../components/shared/Button'
import Panel from '../components/shared/Panel'
import TerminalInput from '../components/shared/TerminalInput'
import { pdfPagesToImages } from '../utils/imageHelpers'
import { validateFile, getPdfPageCount } from '../utils/pdfHelpers'

export default function PdfToJpg() {
  const [file, setFile] = useState(null)
  const [pageCount, setPageCount] = useState(0)
  const [format, setFormat] = useState('jpeg')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
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
    try {
      const count = await getPdfPageCount(f)
      setFile(f)
      setPageCount(count)
    } catch {
      setError('Could not read PDF. The file may be corrupted or password-protected.')
      toast.error('Could not read PDF')
    }
  }

  const convert = async () => {
    if (!file) return
    setProcessing(true)
    setProgress(0)
    try {
      const images = await pdfPagesToImages(file, format, setProgress)

      if (images.length === 1) {
        saveAs(images[0].blob, images[0].name)
      } else {
        const zip = new JSZip()
        images.forEach((img) => zip.file(img.name, img.blob))
        const zipBlob = await zip.generateAsync({ type: 'blob' })
        saveAs(zipBlob, 'pdfkaro-pages.zip')
      }
      toast.success('Download started!')
    } catch (err) {
      toast.error(err.message || 'Conversion failed')
    } finally {
      setProcessing(false)
      setProgress(0)
    }
  }

  return (
    <ToolPageLayout
      title="PDF to JPG"
      description="Convert each page of your PDF into a downloadable image. Multiple pages are bundled in a ZIP file."
    >
      {!file ? (
        <UploadZone
          onFiles={handleFile}
          accept="application/pdf"
          label="Drop your PDF here"
          sublabel="PDF files only"
        />
      ) : (
        <>
          <Panel title="+--- FILE INFO ---+">
            <p className="text-sm text-primary">{file.name}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted">{pageCount} page{pageCount !== 1 ? 's' : ''}</p>
            <button
              onClick={() => {
                setFile(null)
                setPageCount(0)
              }}
              className="mt-3 border border-border px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-muted transition-colors hover:border-primary hover:text-primary"
            >
              choose a different file
            </button>
          </Panel>

          <Panel title="+--- OUTPUT FORMAT ---+">
            <div className="flex flex-wrap gap-2">
              {['jpeg', 'png'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`border px-3 py-2 text-[10px] uppercase tracking-[0.25em] transition-colors ${
                    format === f
                      ? 'border-primary bg-primary text-background'
                      : 'border-border text-primary hover:border-primary hover:bg-primary/10'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </Panel>

          {processing && <ProgressBar progress={progress} label="Converting pages..." />}

          <Button onClick={convert} disabled={processing} variant="primary">
            <Download className="h-4 w-4" />
            {processing ? 'Converting...' : pageCount > 1 ? '[ DOWNLOAD ZIP ]' : '[ DOWNLOAD IMAGE ]'}
          </Button>
        </>
      )}

      <ErrorBanner message={error} />
    </ToolPageLayout>
  )
}
