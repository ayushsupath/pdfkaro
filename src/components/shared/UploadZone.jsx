import { useCallback, useState } from 'react'
import { Upload, FileWarning } from 'lucide-react'

export default function UploadZone({
  onFiles,
  accept,
  multiple = false,
  maxFiles,
  label = 'Drag & drop files here',
  sublabel = 'or click to browse',
  icon: Icon = Upload,
}) {
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = useCallback(
    (fileList) => {
      if (!fileList?.length) return
      let files = Array.from(fileList)
      if (maxFiles) files = files.slice(0, maxFiles)
      onFiles(files)
    },
    [onFiles, maxFiles]
  )

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragOver(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={`block cursor-pointer rounded-xl border-2 border-black bg-ui p-6 shadow-hard-sm transition-all duration-200 ${
        dragOver ? 'translate-x-1 translate-y-1 shadow-hard-none' : 'hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-sm'
      }`}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-charcoal">[upload]</p>
          <p className="mt-3 text-base font-heading font-semibold uppercase tracking-[0.15em] text-ink">
            drop your file to convert
          </p>
          <p className="mt-3 text-sm text-brand-charcoal/80">{label}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-brand-charcoal/60">{sublabel}</p>
        </div>
        <div className={`border-2 px-2 py-1 text-[10px] uppercase tracking-[0.3em] ${
          dragOver ? 'border-black text-ink' : 'border-brand-charcoal text-brand-charcoal'
        }`}> 
          {dragOver ? '[OK]' : '[IN]'}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-brand-charcoal/70">
        <Icon className="h-4 w-4" />
        <span>dropzone ready</span>
      </div>
    </label>
  )
}

export function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div className="rounded-md border-2 border-black bg-ui p-4 shadow-hard-sm">
      <div className="flex items-start gap-3">
        <FileWarning className="mt-0.5 h-5 w-5 text-ink" />
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-ink">Error</p>
          <p className="mt-1 text-sm text-brand-charcoal/80">{message}</p>
        </div>
      </div>
    </div>
  )
}
