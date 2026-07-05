import { useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Eraser } from 'lucide-react'

export default function DrawSignature({ onChange }) {
  const sigRef = useRef(null)

  const handleEnd = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      onChange(sigRef.current.toDataURL('image/png'))
    }
  }

  const clear = () => {
    sigRef.current?.clear()
    onChange(null)
  }

  return (
    <div>
      <div className="overflow-hidden rounded-xl border-2 border-black bg-ui">
        <SignatureCanvas
          ref={sigRef}
          penColor="#1e1b4b"
          canvasProps={{
            className: 'w-full h-40 cursor-crosshair',
          }}
          onEnd={handleEnd}
        />
      </div>
      <button
        onClick={clear}
        className="mt-2 inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-ui px-3 py-2 text-sm text-ink shadow-hard-sm transition duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-none"
      >
        <Eraser className="h-4 w-4" />
        Clear
      </button>
    </div>
  )
}
