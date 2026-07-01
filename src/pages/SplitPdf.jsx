import { useState } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import { Download } from 'lucide-react'
import ToolPageLayout from '../components/shared/ToolPageLayout'
import UploadZone, { ErrorBanner } from '../components/shared/UploadZone'
import ProgressBar from '../components/shared/ProgressBar'
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
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
            <p className="text-sm text-gray-500">{pageCount} page{pageCount !== 1 ? 's' : ''}</p>
            <button
              onClick={() => {
                setFile(null)
                setPageCount(0)
              }}
              className="mt-2 text-sm text-primary-600 hover:underline dark:text-primary-400"
            >
              Choose a different file
            </button>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Split mode
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => setMode('all')}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  mode === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                Split into individual pages
              </button>
              <button
                onClick={() => setMode('extract')}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  mode === 'extract'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                Extract specific pages
              </button>
            </div>
          </div>

          {mode === 'extract' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Page numbers
              </label>
              <input
                type="text"
                value={pageRanges}
                onChange={(e) => setPageRanges(e.target.value)}
                placeholder="e.g. 1,3,5-7"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500">
                Use commas for individual pages and dashes for ranges
              </p>
            </div>
          )}

          {processing && <ProgressBar progress={progress} label="Splitting PDF..." />}

          <button
            onClick={split}
            disabled={processing}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50 sm:w-auto"
          >
            <Download className="h-5 w-5" />
            {processing ? 'Splitting...' : mode === 'all' ? 'Download ZIP of Pages' : 'Download Extracted PDF'}
          </button>
        </>
      )}

      <ErrorBanner message={error} />
    </ToolPageLayout>
  )
}
