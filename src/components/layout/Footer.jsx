import { Shield } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-xs font-bold text-white">
                PK
              </div>
              <span className="font-bold text-gray-900 dark:text-white">PDFKaro</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              PDFKaro — Free. Private. No Login. Just Kaam Ho Jaye.
            </p>
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
              <Shield className="h-4 w-4 text-primary-600" />
              Why PDFKaro is different
            </h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Unlike other PDF tools, PDFKaro processes everything locally in your browser.
              Your files are never uploaded to any server — no accounts, no watermarks, no limits.
              It&apos;s fast, free, and truly private.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-gray-200 pt-6 dark:border-gray-800 sm:flex-row">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} PDFKaro. All processing happens on your device.
          </p>
          <p className="text-xs font-medium text-primary-600 dark:text-primary-400">
            🔒 100% Private — Your files never leave your device
          </p>
        </div>
      </div>
    </footer>
  )
}
