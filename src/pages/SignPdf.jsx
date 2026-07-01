import { useState, useCallback, useRef } from 'react'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Save, Trash2, Plus, Calendar, Type } from 'lucide-react'
import ToolPageLayout from '../components/shared/ToolPageLayout'
import UploadZone, { ErrorBanner } from '../components/shared/UploadZone'
import ProgressBar from '../components/shared/ProgressBar'
import DrawSignature from '../components/signature/DrawSignature'
import TypeSignature from '../components/signature/TypeSignature'
import UploadSignature from '../components/signature/UploadSignature'
import PDFPreviewCanvas from '../components/signature/PDFPreviewCanvas'
import { embedSignatureOnPdf } from '../utils/imageHelpers'
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
    const err = validateFile(f, { types: ['application/pdf'] })
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
      toast.error('Upload a PDF first')
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
      const blob = await embedSignatureOnPdf(pdfFile, placements, qrDataUrl)
      setProgress(100)
      saveAs(blob, 'pdfkaro-signed.pdf')
      toast.success('Signed PDF downloaded!')
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
          accept="application/pdf"
          label="Upload the PDF you want to sign"
          sublabel="Your file stays on your device"
        />
      ) : (
        <>
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <p className="font-medium text-gray-900 dark:text-white">{pdfFile.name}</p>
            <button
              onClick={() => {
                setPdfFile(null)
                setPlacements([])
              }}
              className="mt-1 text-sm text-primary-600 hover:underline dark:text-primary-400"
            >
              Choose a different file
            </button>
          </div>

          {/* Step 2: Create Signature */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
              1. Create your signature
            </h3>

            <div className="mb-4 flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-primary-700 shadow-sm dark:bg-gray-900 dark:text-primary-400'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400'
                  }`}
                >
                  {tab.label}
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
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                <p className="mb-2 text-xs font-medium text-gray-500">Current signature</p>
                <img src={currentSignature} alt="Signature preview" className="max-h-16" />
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={saveSignatureLocally}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Save className="h-4 w-4" />
                Save locally
              </button>
              {savedSignature && (
                <>
                  <button
                    onClick={loadSavedSignature}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700 hover:bg-primary-100 dark:bg-primary-950/40 dark:text-primary-300"
                  >
                    Load saved
                  </button>
                  <button
                    onClick={() => {
                      clearSavedSignature()
                      toast.success('Saved signature cleared')
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Step 3: Place on PDF */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
              2. Place on PDF
            </h3>

            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={() => addPlacement('signature')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                <Plus className="h-4 w-4" />
                Add signature
              </button>
              <button
                onClick={() => addPlacement('date')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
              >
                <Calendar className="h-4 w-4" />
                Add date
              </button>
              <button
                onClick={() => addPlacement('initials')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
              >
                <Type className="h-4 w-4" />
                Add initials
              </button>
            </div>

            <p className="mb-4 text-xs text-gray-500">
              Click on a page to place a signature, or use the buttons above. Drag to reposition. Select a placement to resize.
            </p>

            {activePlacementId && (
              <button
                onClick={() => removePlacement(activePlacementId)}
                className="mb-4 text-sm text-red-600 hover:underline"
              >
                Remove selected placement
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
          </div>

          {/* Step 4: Download */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
              3. Download signed PDF
            </h3>

            <label className="mb-4 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={includeQr}
                onChange={(e) => setIncludeQr(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              Include verification QR code (visual trust marker)
            </label>

            {includeQr && verificationHash && (
              <div className="mb-4 flex items-center gap-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                <QRCodeCanvas
                  ref={qrRef}
                  value={`PDFKaro Signed | ${verificationHash} | ${new Date().toISOString()}`}
                  size={64}
                  level="M"
                />
                <div>
                  <p className="text-xs text-gray-500">Verification ID</p>
                  <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                    {verificationHash}
                  </p>
                  <p className="text-xs text-gray-500">
                    Signed on {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {processing && <ProgressBar progress={progress} label="Creating signed PDF..." />}

            <button
              onClick={downloadSigned}
              disabled={processing || !placements.length}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-50 sm:w-auto"
            >
              <Download className="h-5 w-5" />
              {processing ? 'Signing...' : 'Download Signed PDF'}
            </button>
          </div>
        </>
      )}

      <ErrorBanner message={error} />
    </ToolPageLayout>
  )
}
