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
import { splitPdf } from '../utils/imageHelpers'
import { validateFile, getPdfPageCount } from '../utils/pdfHelpers'

export default function SplitPdf() {
  const [file, setFile] = useState(null)
  const [pageCount, setPageCount] = useState(0)
  const [mode, setMode] = useState('all')
  const [pageRanges, setPageRanges] = useState('')
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

  const split = async () => {
    if (!file) return
    if (mode === 'extract' && !pageRanges.trim()) {
      toast.error('Enter page numbers to extract (e.g. 1,3,5-7)')
      return
    }
    setProcessing(true)
    setProgress(0)
    try {
      const results = await splitPdf(file, mode, pageRanges, setProgress)

      if (results.length === 1) {
        saveAs(results[0].blob, results[0].name)
      } else {
        const zip = new JSZip()
        results.forEach((r) => zip.file(r.name, r.blob))
        const zipBlob = await zip.generateAsync({ type: 'blob' })
        saveAs(zipBlob, 'pdfkaro-split.zip')
      }
      toast.success('Download started!')
    } catch (err) {
      toast.error(err.message || 'Split failed')
    } finally {
      setProcessing(false)
      setProgress(0)
    }
  }

  return (
    <ToolPageLayout
      title="Split PDF"
      description="Split your PDF into individual pages or extract specific pages."
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
            <p className="text-sm font-semibold text-ink">{file.name}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-brand-charcoal/70">{pageCount} page{pageCount !== 1 ? 's' : ''}</p>
            <button
              onClick={() => {
                setFile(null)
                setPageCount(0)
              }}
              className="mt-3 rounded-md border-2 border-black bg-ui px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-ink shadow-hard-sm transition duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-none"
            >
              choose a different file
            </button>
          </Panel>

          <Panel title="+--- SPLIT MODE ---+">
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => setMode('all')}
                className={`rounded-md border-2 border-black px-3 py-2 text-[10px] uppercase tracking-[0.25em] transition duration-200 ${
                  mode === 'all'
                    ? 'bg-ink text-ui shadow-hard-sm'
                    : 'bg-ui text-ink shadow-hard-none hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-sm'
                }`}
              >
                split into individual pages
              </button>
              <button
                onClick={() => setMode('extract')}
                className={`rounded-md border-2 border-black px-3 py-2 text-[10px] uppercase tracking-[0.25em] transition duration-200 ${
                  mode === 'extract'
                    ? 'bg-ink text-ui shadow-hard-sm'
                    : 'bg-ui text-ink shadow-hard-none hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-sm'
                }`}
              >
                extract specific pages
              </button>
            </div>
          </Panel>

          {mode === 'extract' && (
            <Panel title="+--- PAGE RANGE ---+">
              <TerminalInput
                type="text"
                value={pageRanges}
                onChange={(e) => setPageRanges(e.target.value)}
                placeholder="e.g. 1,3,5-7"
              />
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-brand-charcoal/70">
                use commas for individual pages and dashes for ranges
              </p>
            </Panel>
          )}

          {processing && <ProgressBar progress={progress} label="Splitting PDF..." />}

          <Button onClick={split} disabled={processing} variant="primary">
            <Download className="h-4 w-4" />
            {processing ? 'Splitting...' : mode === 'all' ? '[ DOWNLOAD ZIP ]' : '[ DOWNLOAD EXTRACTED PDF ]'}
          </Button>
        </>
      )}

      <ErrorBanner message={error} />
    </ToolPageLayout>
  )
}
