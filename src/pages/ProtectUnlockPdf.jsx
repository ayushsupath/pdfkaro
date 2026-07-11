import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import { Download, Lock, Unlock, AlertTriangle } from 'lucide-react'
import ToolPageLayout from '../components/shared/ToolPageLayout'
import UploadZone, { ErrorBanner } from '../components/shared/UploadZone'
import ProgressBar from '../components/shared/ProgressBar'
import Button from '../components/shared/Button'
import Panel from '../components/shared/Panel'
import { formatFileSize, validateFile } from '../utils/pdfHelpers'

export default function ProtectUnlockPdf() {
  const [mode, setMode] = useState('unlock') // 'unlock' or 'protect'
  const [file, setFile] = useState(null)
  const [password, setPassword] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const handleFile = (files) => {
    setError(null)
    setResult(null)
    setPassword('')
    const f = files[0]
    
    const err = validateFile(f, { types: ['application/pdf'] })
    if (err) {
      setError(err)
      toast.error(err)
      return
    }
    setFile(f)
  }

  const handleUnlock = async (e) => {
    e.preventDefault()
    if (!file || !password) return
    setProcessing(true)
    setError(null)
    
    try {
      const arrayBuffer = await file.arrayBuffer()
      // Try to load with the provided password
      const pdfDoc = await PDFDocument.load(arrayBuffer, { password })
      
      // If we got here, it decrypted successfully.
      // Saving it now will result in an unprotected PDF.
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      
      setResult({
        blob,
        name: file.name.replace(/\.pdf$/i, '-unlocked.pdf')
      })
      toast.success('PDF unlocked successfully!')
    } catch (e) {
      console.error(e)
      setError('Incorrect password or unable to read PDF.')
      toast.error('Failed to unlock PDF')
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
      title="Protect & Unlock PDF"
      description="Remove passwords from your PDF files entirely in your browser."
    >
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setMode('unlock'); setFile(null); setResult(null); }}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md border-2 border-black px-4 py-3 font-heading font-bold uppercase tracking-[0.2em] transition duration-200 ${
            mode === 'unlock'
              ? 'bg-ink text-ui shadow-hard-sm'
              : 'bg-ui text-ink shadow-hard-none hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-sm'
          }`}
        >
          <Unlock className="h-4 w-4" />
          Unlock PDF
        </button>
        <button
          onClick={() => { setMode('protect'); setFile(null); setResult(null); }}
          className={`flex-1 flex items-center justify-center gap-2 rounded-md border-2 border-black px-4 py-3 font-heading font-bold uppercase tracking-[0.2em] transition duration-200 ${
            mode === 'protect'
              ? 'bg-ink text-ui shadow-hard-sm'
              : 'bg-ui text-ink shadow-hard-none hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-sm'
          }`}
        >
          <Lock className="h-4 w-4" />
          Protect PDF
        </button>
      </div>

      {mode === 'protect' ? (
        <div className="rounded-xl border-2 border-black bg-brand-yellow p-8 text-center shadow-hard-md">
          <AlertTriangle className="mx-auto h-12 w-12 text-ink mb-4" />
          <h2 className="text-xl font-heading font-bold uppercase tracking-widest text-ink">Not Supported Client-Side</h2>
          <p className="mt-4 max-w-md mx-auto text-sm leading-relaxed text-brand-charcoal">
            Encrypting and protecting a PDF with a new password directly in the browser is not fully supported by our current PDF engine without relying on a backend server. 
            <br /><br />
            To maintain our 100% private, serverless guarantee, we have disabled this feature for now.
          </p>
        </div>
      ) : (
        <>
          {!file ? (
            <UploadZone
              onFiles={handleFile}
              accept="application/pdf"
              label="Drop your protected PDF here"
              sublabel="PDF files only"
            />
          ) : (
            <div className="space-y-6">
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
                          setPassword('')
                        }}
                        className="mt-3 rounded-md border-2 border-black bg-ui px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-ink shadow-hard-sm transition duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-none"
                      >
                        choose a different file
                      </button>
                    )}
                  </div>
                </div>
              </Panel>

              {!result ? (
                <Panel title="+--- UNLOCK PDF ---+">
                  <form onSubmit={handleUnlock} className="space-y-4">
                    <div>
                      <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-brand-charcoal mb-2">
                        Enter Document Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password..."
                        className="w-full rounded-md border-2 border-black bg-white px-4 py-3 font-medium outline-none transition focus:shadow-hard-sm"
                        required
                        disabled={processing}
                      />
                    </div>
                    <Button type="submit" disabled={processing || !password} variant="primary">
                      <Unlock className="h-4 w-4" />
                      {processing ? 'Unlocking...' : '[ UNLOCK PDF ]'}
                    </Button>
                  </form>
                </Panel>
              ) : (
                <div className="flex gap-4">
                  <Button onClick={handleDownload} variant="primary" className="flex-1">
                    <Download className="h-4 w-4" />
                    [ DOWNLOAD UNLOCKED PDF ]
                  </Button>
                  <button
                    onClick={() => {
                      setFile(null)
                      setResult(null)
                      setPassword('')
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
        </>
      )}
    </ToolPageLayout>
  )
}
