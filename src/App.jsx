import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import JpgToPdf from './pages/JpgToPdf'
import PdfToJpg from './pages/PdfToJpg'
import MergePdf from './pages/MergePdf'
import SplitPdf from './pages/SplitPdf'
import SignPdf from './pages/SignPdf'
import { useThemeStore } from './store/useStore'

export default function App() {
  const initTheme = useThemeStore((s) => s.initTheme)

  useEffect(() => {
    initTheme()
  }, [initTheme])

  return (
    <BrowserRouter>
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: 'border border-border bg-background text-primary font-mono rounded-none',
          duration: 3000,
        }}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="jpg-to-pdf" element={<JpgToPdf />} />
          <Route path="pdf-to-jpg" element={<PdfToJpg />} />
          <Route path="merge-pdf" element={<MergePdf />} />
          <Route path="split-pdf" element={<SplitPdf />} />
          <Route path="sign-pdf" element={<SignPdf />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
