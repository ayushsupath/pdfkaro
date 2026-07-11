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
import WordToPdf from './pages/WordToPdf'
import RotatePdf from './pages/RotatePdf'
import CompressPdf from './pages/CompressPdf'
import PdfToWord from './pages/PdfToWord'
import ExcelToPdf from './pages/ExcelToPdf'
import PowerPointToPdf from './pages/PowerPointToPdf'
import ProtectUnlockPdf from './pages/ProtectUnlockPdf'
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
          className: 'border-2 border-black bg-ui text-ink font-medium rounded-md shadow-hard-sm',
          duration: 3000,
        }}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="jpg-to-pdf" element={<JpgToPdf />} />
          <Route path="pdf-to-jpg" element={<PdfToJpg />} />
          <Route path="word-to-pdf" element={<WordToPdf />} />
          <Route path="merge-pdf" element={<MergePdf />} />
          <Route path="split-pdf" element={<SplitPdf />} />
          <Route path="sign-pdf" element={<SignPdf />} />
          <Route path="rotate-pdf" element={<RotatePdf />} />
          <Route path="compress-pdf" element={<CompressPdf />} />
          <Route path="pdf-to-word" element={<PdfToWord />} />
          <Route path="excel-to-pdf" element={<ExcelToPdf />} />
          <Route path="powerpoint-to-pdf" element={<PowerPointToPdf />} />
          <Route path="unlock-pdf" element={<ProtectUnlockPdf />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
