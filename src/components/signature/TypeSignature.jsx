import { useEffect, useRef } from 'react'
import { SIGNATURE_FONTS } from '../../utils/constants'

export default function TypeSignature({ text, setText, fontId, setFontId, onSignatureReady }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!text.trim()) {
      onSignatureReady(null)
      return
    }

    const font = SIGNATURE_FONTS.find((f) => f.id === fontId) || SIGNATURE_FONTS[0]
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const fontFamily = font.name
    ctx.font = `48px "${fontFamily}"`
    const metrics = ctx.measureText(text)
    const padding = 20
    canvas.width = metrics.width + padding * 2
    canvas.height = 80

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = `48px "${fontFamily}"`
    ctx.fillStyle = '#1e1b4b'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, padding, canvas.height / 2)

    onSignatureReady(canvas.toDataURL('image/png'))
  }, [text, fontId, onSignatureReady])

  const font = SIGNATURE_FONTS.find((f) => f.id === fontId) || SIGNATURE_FONTS[0]

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your name"
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
      />

      <div className="flex flex-wrap gap-2">
        {SIGNATURE_FONTS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFontId(f.id)}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              fontId === f.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        {text ? (
          <p className={`text-4xl text-indigo-950 dark:text-indigo-100 ${font.className}`}>
            {text}
          </p>
        ) : (
          <p className="text-sm text-gray-400">Preview will appear here</p>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
