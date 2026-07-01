import { useState } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import { Download } from 'lucide-react'
import ToolPageLayout from '../components/shared/ToolPageLayout'
import UploadZone, { ErrorBanner } from '../components/shared/UploadZone'
import ProgressBar from '../components/shared/ProgressBar'
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
              Output format
            </label>
            <div className="flex gap-2">
              {['jpeg', 'png'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    format === f
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {processing && <ProgressBar progress={progress} label="Converting pages..." />}

          <button
            onClick={convert}
            disabled={processing}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50 sm:w-auto"
          >
            <Download className="h-5 w-5" />
            {processing ? 'Converting...' : pageCount > 1 ? 'Download ZIP' : 'Download Image'}
          </button>
        </>
      )}

      <ErrorBanner message={error} />
    </ToolPageLayout>
  )
}
