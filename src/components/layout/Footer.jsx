export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background/95">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="border border-border bg-black/70 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] uppercase tracking-[0.3em] text-primary">
              system.status: idle | files_processed_locally: 0 | privacy: enforced_
            </p>
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted">
              pdfkaro@local:~$ no server required_
            </p>
          </div>
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <p className="mt-4 text-sm leading-relaxed text-primary/80">
            PDFKaro processes every tool locally in your browser. No uploads. No login. No watermark.
          </p>
        </div>
      </div>
    </footer>
  )
}
