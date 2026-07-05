export default function Footer() {
  return (
    <footer className="bg-brand-charcoal border-t-2 border-black text-ui">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-4 sm:px-6">
        <div>
          <p className="mb-4 text-sm font-heading font-bold uppercase tracking-[0.3em]">Tools</p>
          <ul className="space-y-3 text-sm text-brand-sage/90">
            <li><a href="/jpg-to-pdf">JPG to PDF</a></li>
            <li><a href="/pdf-to-jpg">PDF to JPG</a></li>
            <li><a href="/word-to-pdf">Word to PDF</a></li>
            <li><a href="/merge-pdf">Merge PDF</a></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-sm font-heading font-bold uppercase tracking-[0.3em]">About</p>
          <p className="text-sm text-brand-sage/90">PDFKaro is a browser-first PDF toolkit designed to keep your files private. No upload, no login, no tracking.</p>
        </div>
        <div>
          <p className="mb-4 text-sm font-heading font-bold uppercase tracking-[0.3em]">Privacy</p>
          <p className="text-sm text-brand-sage/90">Everything is processed locally in your browser. Your documents never leave your device.</p>
        </div>
        <div>
          <p className="mb-4 text-sm font-heading font-bold uppercase tracking-[0.3em]">Contact</p>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/ayushsupath/pdfkaro"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-sm border-2 border-brand-sage bg-[#272727] text-brand-sage transition-all duration-200 hover:border-black hover:bg-brand-yellow hover:text-ink"
            >
              G
            </a>
            <div className="text-sm text-brand-sage/90">GitHub</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
