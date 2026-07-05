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
        className="w-full rounded-xl border-2 border-black bg-ui px-4 py-3 text-ink outline-none focus:border-black focus:ring-2 focus:ring-brand-yellow"
      />

      <div className="flex flex-wrap gap-2">
        {SIGNATURE_FONTS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFontId(f.id)}
            className={`rounded-md border-2 border-black px-3 py-1.5 text-sm transition duration-200 ${
              fontId === f.id
                ? 'bg-ink text-ui shadow-hard-sm'
                : 'bg-ui text-ink shadow-hard-none hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-sm'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="rounded-xl border-2 border-black bg-ui p-6 shadow-hard-sm">
        {text ? (
          <p className={`text-4xl text-ink ${font.className}`}>
            {text}
          </p>
        ) : (
          <p className="text-sm text-brand-charcoal/70">Preview will appear here</p>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
