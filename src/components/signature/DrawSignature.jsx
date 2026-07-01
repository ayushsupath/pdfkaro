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
      <div className="overflow-hidden rounded-xl border-2 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
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
        className="mt-2 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        <Eraser className="h-4 w-4" />
        Clear
      </button>
    </div>
  )
}
