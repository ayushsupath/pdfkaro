import { useState, useCallback, useRef } from 'react'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Save, Trash2, Plus, Calendar, Type } from 'lucide-react'
import ToolPageLayout from '../components/shared/ToolPageLayout'
import UploadZone, { ErrorBanner } from '../components/shared/UploadZone'
import ProgressBar from '../components/shared/ProgressBar'
import Button from '../components/shared/Button'
import Panel from '../components/shared/Panel'
import TerminalInput from '../components/shared/TerminalInput'
import DrawSignature from '../components/signature/DrawSignature'
import TypeSignature from '../components/signature/TypeSignature'
import UploadSignature from '../components/signature/UploadSignature'
import PDFPreviewCanvas from '../components/signature/PDFPreviewCanvas'
import { embedSignatureOnPdf, embedSignatureOnImage } from '../utils/imageHelpers'
import { validateFile, generateVerificationHash } from '../utils/pdfHelpers'
import { useSignatureStore } from '../store/useStore'

const TABS = [
  { id: 'draw', label: 'Draw' },
  { id: 'type', label: 'Type' },
  { id: 'upload', label: 'Upload' },
]

export default function SignPdf() {
  const [pdfFile, setPdfFile] = useState(null)
  const [activeTab, setActiveTab] = useState('draw')
  const [currentSignature, setCurrentSignature] = useState(null)
  const [typedName, setTypedName] = useState('')
  const [fontId, setFontId] = useState('signature-1')
  const [placements, setPlacements] = useState([])
  const [activePlacementId, setActivePlacementId] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [includeQr, setIncludeQr] = useState(true)
  const [verificationHash, setVerificationHash] = useState(null)
  const qrRef = useRef(null)

  const { savedSignature, setSavedSignature, clearSavedSignature } = useSignatureStore()

  const handlePdfUpload = (files) => {
    setError(null)
    const f = files[0]
    const err = validateFile(f, { types: ['application/pdf', 'image/jpeg', 'image/png'] })
    if (err) {
      setError(err)
      toast.error(err)
      return
    }
    setPdfFile(f)
    setPlacements([])
    setVerificationHash(generateVerificationHash())
  }

  const handleSignatureReady = useCallback((dataUrl) => {
    setCurrentSignature(dataUrl)
  }, [])

  const saveSignatureLocally = () => {
    if (!currentSignature) {
      toast.error('Create a signature first')
      return
    }
    setSavedSignature(currentSignature)
    toast.success('Signature saved locally!')
  }

  const loadSavedSignature = () => {
    if (savedSignature) {
      setCurrentSignature(savedSignature)
      toast.success('Saved signature loaded')
    }
  }

  const addPlacement = (type = 'signature') => {
    if (!currentSignature && type === 'signature') {
      toast.error('Create or load a signature first')
      return
    }

    let imageDataUrl = currentSignature

    if (type === 'date') {
      const canvas = document.createElement('canvas')
      canvas.width = 200
      canvas.height = 40
      const ctx = canvas.getContext('2d')
      ctx.font = '16px Inter, sans-serif'
      ctx.fillStyle = '#1e1b4b'
      ctx.textBaseline = 'middle'
      ctx.fillText(new Date().toLocaleDateString(), 10, 20)
      imageDataUrl = canvas.toDataURL('image/png')
    }

    if (type === 'initials' && typedName) {
      const canvas = document.createElement('canvas')
      canvas.width = 60
      canvas.height = 40
      const ctx = canvas.getContext('2d')
      ctx.font = 'bold 20px Inter, sans-serif'
      ctx.fillStyle = '#1e1b4b'
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      const initials = typedName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
      ctx.fillText(initials, 30, 20)
      imageDataUrl = canvas.toDataURL('image/png')
    }

    if (!imageDataUrl) return

    const placement = {
      id: crypto.randomUUID(),
      imageDataUrl,
      pageIndex: 0,
      xRatio: 0.5,
      yRatio: 0.7,
      widthRatio: type === 'date' ? 0.2 : 0.25,
      type,
    }
    setPlacements((prev) => [...prev, placement])
    setActivePlacementId(placement.id)
    toast.success(`${type === 'signature' ? 'Signature' : type === 'date' ? 'Date stamp' : 'Initials'} added — drag to position`)
  }

  const updatePlacement = (id, updates) => {
    setPlacements((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  const removePlacement = (id) => {
    setPlacements((prev) => prev.filter((p) => p.id !== id))
    if (activePlacementId === id) setActivePlacementId(null)
  }

  const handlePageClick = (e, pageIndex, container) => {
    if (!currentSignature) return
    const rect = container.getBoundingClientRect()
    const xRatio = (e.clientX - rect.left) / rect.width
    const yRatio = (e.clientY - rect.top) / rect.height

    const placement = {
      id: crypto.randomUUID(),
      imageDataUrl: currentSignature,
      pageIndex,
      xRatio,
      yRatio,
      widthRatio: 0.25,
      type: 'signature',
    }
    setPlacements((prev) => [...prev, placement])
    setActivePlacementId(placement.id)
  }

  const downloadSigned = async () => {
    if (!pdfFile) {
      toast.error('Upload a file first')
      return
    }
    if (!placements.length) {
      toast.error('Add at least one signature placement')
      return
    }

    setProcessing(true)
    setProgress(30)

    try {
      let qrDataUrl = null
      if (includeQr && qrRef.current) {
        qrDataUrl = qrRef.current.toDataURL('image/png')
      }

      setProgress(60)
      
      let blob;
      if (pdfFile.type.startsWith('image/')) {
        blob = await embedSignatureOnImage(pdfFile, placements, qrDataUrl)
      } else {
        blob = await embedSignatureOnPdf(pdfFile, placements, qrDataUrl)
      }
      
      setProgress(100)
      
      const ext = pdfFile.type === 'image/png' ? 'png' : pdfFile.type === 'image/jpeg' ? 'jpg' : 'pdf'
      saveAs(blob, `pdfkaro-signed.${ext}`)
      toast.success('Signed file downloaded!')
    } catch (err) {
      toast.error(err.message || 'Signing failed')
    } finally {
      setProcessing(false)
      setProgress(0)
    }
  }

  return (
    <ToolPageLayout
      title="Sign PDF"
      description="Create your signature, place it on any page, and download the signed PDF. Signatures are saved locally for next time."
    >
      {/* Step 1: Upload PDF */}
      {!pdfFile ? (
        <UploadZone
          onFiles={handlePdfUpload}
          accept="application/pdf,image/jpeg,image/png"
          label="Upload the PDF or image you want to sign"
          sublabel="Your file stays on your device"
        />
      ) : (
        <>
          <Panel title="+--- FILE INFO ---+">
            <p className="text-sm font-semibold text-ink">{pdfFile.name}</p>
            <button
              onClick={() => {
                setPdfFile(null)
                setPlacements([])
              }}
              className="mt-3 rounded-md border-2 border-black bg-ui px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-ink shadow-hard-sm transition duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-none"
            >
              choose a different file
            </button>
          </Panel>

          {/* Step 2: Create Signature */}
          <Panel title="+--- CREATE SIGNATURE ---+">
            <h3 className="mb-4 text-[10px] uppercase tracking-[0.3em] text-brand-charcoal/70">
              1. create your signature
            </h3>

            <div className="mb-4 flex flex-wrap gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-md border-2 border-black px-3 py-2 text-[10px] uppercase tracking-[0.25em] transition duration-200 ${
                    activeTab === tab.id
                      ? 'bg-ink text-ui shadow-hard-sm'
                      : 'bg-ui text-ink shadow-hard-none hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-sm'
                  }`}
                >
                  --{tab.label.toLowerCase()}
                </button>
              ))}
            </div>

            {activeTab === 'draw' && <DrawSignature onChange={handleSignatureReady} />}
            {activeTab === 'type' && (
              <TypeSignature
                text={typedName}
                setText={setTypedName}
                fontId={fontId}
                setFontId={setFontId}
                onSignatureReady={handleSignatureReady}
              />
            )}
            {activeTab === 'upload' && <UploadSignature onSignatureReady={handleSignatureReady} />}

            {currentSignature && (
              <div className="mt-4 rounded-xl border-2 border-black bg-ui p-3 shadow-hard-sm">
                <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-brand-charcoal/70">current signature</p>
                <img src={currentSignature} alt="Signature preview" className="max-h-16 w-full rounded-sm border-2 border-black p-1" />
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={saveSignatureLocally} variant="ghost">
                <Save className="h-4 w-4" />
                save locally
              </Button>
              {savedSignature && (
                <>
                  <Button onClick={loadSavedSignature} variant="primary">
                    load saved
                  </Button>
                  <button
                    onClick={() => {
                      clearSavedSignature()
                      toast.success('Saved signature cleared')
                    }}
                    className="rounded-md border-2 border-black bg-ui px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-ink shadow-hard-sm transition duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-none"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </Panel>

          <Panel title="+--- PLACE ON DOCUMENT ---+">
            <h3 className="mb-4 text-[10px] uppercase tracking-[0.3em] text-brand-charcoal/70">
              2. place on document
            </h3>

            <div className="mb-4 flex flex-wrap gap-2">
              <Button onClick={() => addPlacement('signature')} variant="primary">
                <Plus className="h-4 w-4" />
                add signature
              </Button>
              <Button onClick={() => addPlacement('date')} variant="ghost">
                <Calendar className="h-4 w-4" />
                add date
              </Button>
              <Button onClick={() => addPlacement('initials')} variant="ghost">
                <Type className="h-4 w-4" />
                add initials
              </Button>
            </div>

            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-brand-charcoal/70">
              click on a page to place a signature, or use the buttons above. drag to reposition. select a placement to resize.
            </p>

            {activePlacementId && (
              <button
                onClick={() => removePlacement(activePlacementId)}
                className="mb-4 rounded-md border-2 border-black bg-ui px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-ink shadow-hard-sm transition duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-none"
              >
                remove selected placement
              </button>
            )}

            <PDFPreviewCanvas
              pdfFile={pdfFile}
              placements={placements}
              activePlacementId={activePlacementId}
              onUpdatePlacement={updatePlacement}
              onSelectPlacement={setActivePlacementId}
              onPageClick={handlePageClick}
            />
          </Panel>

          <Panel title="+--- DOWNLOAD SIGNED FILE ---+">
            <h3 className="mb-4 text-[10px] uppercase tracking-[0.3em] text-brand-charcoal/70">
              3. download signed file
            </h3>

            <label className="mb-4 flex items-center gap-2 text-sm text-brand-charcoal">
              <input
                type="checkbox"
                checked={includeQr}
                onChange={(e) => setIncludeQr(e.target.checked)}
                className="h-4 w-4 rounded-sm border-2 border-black bg-ui text-ink"
              />
              include verification QR code
            </label>

            {includeQr && verificationHash && (
              <div className="mb-4 flex flex-wrap items-center gap-4 rounded-xl border-2 border-black bg-ui p-3 shadow-hard-sm">
                <QRCodeCanvas
                  ref={qrRef}
                  value={`PDFKaro Signed | ${verificationHash} | ${new Date().toISOString()}`}
                  size={64}
                  level="M"
                />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-brand-charcoal/70">verification id</p>
                  <p className="mt-1 font-mono text-sm text-ink">{verificationHash}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-charcoal/70">
                    signed on {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {processing && <ProgressBar progress={progress} label="Creating signed file..." />}

            <Button onClick={downloadSigned} disabled={processing || !placements.length} variant="primary">
              <Download className="h-4 w-4" />
              {processing ? 'Signing...' : '[ DOWNLOAD SIGNED FILE ]'}
            </Button>
          </Panel>
        </>
      )}

      <ErrorBanner message={error} />
    </ToolPageLayout>
  )
}
