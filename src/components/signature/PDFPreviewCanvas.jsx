import { useEffect, useRef, useState, useCallback } from 'react'
import { loadPdfDocument, renderPageToCanvas } from '../../utils/pdfHelpers'

export default function PDFPreviewCanvas({
  pdfFile,
  placements,
  activePlacementId,
  onUpdatePlacement,
  onSelectPlacement,
  onPageClick,
}) {
  const containerRef = useRef(null)
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!pdfFile) {
      setPages([])
      return
    }

    let cancelled = false
    setLoading(true)

    ;(async () => {
      try {
        const doc = await loadPdfDocument(pdfFile)
        const rendered = []
        for (let i = 1; i <= doc.numPages; i++) {
          if (cancelled) return
          const { canvas, viewport } = await renderPageToCanvas(doc, i, 1.2)
          rendered.push({
            pageIndex: i - 1,
            dataUrl: canvas.toDataURL('image/jpeg', 0.85),
            width: viewport.width,
            height: viewport.height,
          })
        }
        if (!cancelled) setPages(rendered)
        doc.destroy()
      } catch {
        if (!cancelled) setPages([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [pdfFile])

  const handleDrag = useCallback(
    (e, placementId, pageIndex) => {
      e.preventDefault()
      const rect = e.currentTarget.getBoundingClientRect()
      const xRatio = (e.clientX - rect.left) / rect.width
      const yRatio = (e.clientY - rect.top) / rect.height
      onUpdatePlacement(placementId, {
        pageIndex,
        xRatio: Math.max(0, Math.min(1, xRatio)),
        yRatio: Math.max(0, Math.min(1, yRatio)),
      })
    },
    [onUpdatePlacement]
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    )
  }

  if (!pages.length) return null

  return (
    <div ref={containerRef} className="space-y-6">
      {pages.map((page) => (
        <div key={page.pageIndex} className="relative mx-auto" style={{ maxWidth: page.width }}>
          <div
            className="relative shadow-lg"
            onClick={(e) => onPageClick?.(e, page.pageIndex, e.currentTarget)}
          >
            <img
              src={page.dataUrl}
              alt={`Page ${page.pageIndex + 1}`}
              className="w-full rounded-lg"
              draggable={false}
            />
            {placements
              .filter((p) => p.pageIndex === page.pageIndex)
              .map((placement) => (
                <div
                  key={placement.id}
                  className={`absolute cursor-move select-none ${
                    activePlacementId === placement.id
                      ? 'ring-2 ring-primary-500 ring-offset-2'
                      : ''
                  }`}
                  style={{
                    left: `${placement.xRatio * 100}%`,
                    top: `${placement.yRatio * 100}%`,
                    width: `${(placement.widthRatio || 0.25) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectPlacement(placement.id)
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    onSelectPlacement(placement.id)

                    const onMove = (moveEvent) => handleDrag(moveEvent, placement.id, page.pageIndex)
                    const onUp = () => {
                      document.removeEventListener('mousemove', onMove)
                      document.removeEventListener('mouseup', onUp)
                    }
                    document.addEventListener('mousemove', onMove)
                    document.addEventListener('mouseup', onUp)
                  }}
                >
                  <img
                    src={placement.imageDataUrl}
                    alt="Signature"
                    className="w-full pointer-events-none"
                    draggable={false}
                  />
                  {activePlacementId === placement.id && (
                    <input
                      type="range"
                      min="0.1"
                      max="0.6"
                      step="0.01"
                      value={placement.widthRatio || 0.25}
                      onChange={(e) =>
                        onUpdatePlacement(placement.id, {
                          widthRatio: parseFloat(e.target.value),
                        })
                      }
                      className="absolute -bottom-8 left-0 w-full"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </div>
              ))}
          </div>
          <p className="mt-2 text-center text-xs text-gray-500">Page {page.pageIndex + 1}</p>
        </div>
      ))}
    </div>
  )
}
