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
      className={`block cursor-pointer border border-border bg-black/70 p-6 transition-all duration-150 ${
        dragOver ? 'border-primary bg-primary/10' : 'hover:border-primary hover:bg-black/90'
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
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted">[upload]</p>
          <p className="mt-3 text-base font-semibold uppercase tracking-[0.2em] text-primary">
            user@pdfkaro:~$ drop file to continue<span className="cursor-blink">_</span>
          </p>
          <p className="mt-3 text-sm text-primary/80">{label}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted">{sublabel}</p>
        </div>
        <div className={`border px-2 py-1 text-[10px] uppercase tracking-[0.3em] ${dragOver ? 'border-primary text-primary' : 'border-border text-muted'}`}>
          {dragOver ? '[OK]' : '[IN]'}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted">
        <Icon className="h-4 w-4" />
        <span>dropzone ready</span>
      </div>
    </label>
  )
}

export function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-3 border border-error/40 bg-black/80 p-4 text-error">
      <FileWarning className="mt-0.5 h-5 w-5 shrink-0" />
      <p className="text-sm">[ERR] {message}</p>
    </div>
  )
}
