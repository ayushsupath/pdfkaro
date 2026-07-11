import { useState, useRef } from 'react'
import { read, utils } from 'xlsx'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import { Download } from 'lucide-react'
import ToolPageLayout from '../components/shared/ToolPageLayout'
import UploadZone, { ErrorBanner } from '../components/shared/UploadZone'
import ProgressBar from '../components/shared/ProgressBar'
import Button from '../components/shared/Button'
import Panel from '../components/shared/Panel'
import { formatFileSize, validateFile } from '../utils/pdfHelpers'

export default function ExcelToPdf() {
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const hiddenContainerRef = useRef(null)

  const handleFile = async (files) => {
    setError(null)
    setResult(null)
    const f = files[0]
    
    // Validate custom extensions since it's not a PDF
    if (!f.name.toLowerCase().match(/\.(xlsx|xls)$/)) {
      setError('Invalid file type. Expected: .xlsx, .xls')
      toast.error('Invalid file type')
      return
    }
    
    const err = validateFile(f) // only checks size
    if (err) {
      setError(err)
      toast.error(err)
      return
    }
    setFile(f)
  }

  const convert = async () => {
    if (!file || !hiddenContainerRef.current) return
    setProcessing(true)
    setProgress(0)
    setResult(null)
    
    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = read(arrayBuffer, { type: 'array' })
      const sheetNames = workbook.SheetNames
      
      const pdf = new jsPDF('l', 'pt', 'a4')
      
      for (let i = 0; i < sheetNames.length; i++) {
        setProgress(Math.round((i / sheetNames.length) * 80))
        
        const sheetName = sheetNames[i]
        const sheet = workbook.Sheets[sheetName]
        const html = utils.sheet_to_html(sheet)
        
        // Render to DOM
        const container = hiddenContainerRef.current
        container.innerHTML = `
          <div style="padding: 20px; font-family: sans-serif; background: white;">
            <h2 style="margin-top: 0; color: #333;">${sheetName}</h2>
            <style>
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
            ${html}
          </div>
        `
        
        // Wait for render
        await new Promise(resolve => setTimeout(resolve, 50))
        
        const canvas = await html2canvas(container.firstElementChild, {
          scale: 1.5,
          useCORS: true,
          logging: false
        })
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95)
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        
        const imgWidth = canvas.width
        const imgHeight = canvas.height
        const ratio = pdfWidth / imgWidth
        const scaledHeight = imgHeight * ratio
        
        let heightLeft = scaledHeight
        let position = 0
        
        if (i > 0) pdf.addPage()
        
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, scaledHeight)
        heightLeft -= pdfHeight
        
        while (heightLeft > 0) {
          position -= pdfHeight
          pdf.addPage()
          pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, scaledHeight)
          heightLeft -= pdfHeight
        }
        
        // Clear container
        container.innerHTML = ''
      }
      
      setProgress(95)
      const blob = pdf.output('blob')
      setProgress(100)
      
      setResult({
        blob,
        name: file.name.replace(/\.(xlsx|xls)$/i, '.pdf')
      })
      toast.success('Conversion complete!')
    } catch (e) {
      toast.error('Failed to convert Excel to PDF')
      console.error(e)
    } finally {
      setProcessing(false)
      if (hiddenContainerRef.current) {
        hiddenContainerRef.current.innerHTML = ''
      }
    }
  }

  const handleDownload = () => {
    if (result) {
      saveAs(result.blob, result.name)
    }
  }

  return (
    <ToolPageLayout
      title="Excel to PDF"
      description="Convert your spreadsheets (.xlsx, .xls) to PDF documents. Basic conversion — layout may differ slightly from the original spreadsheet."
    >
      {!file ? (
        <UploadZone
          onFiles={handleFile}
          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          label="Drop your Excel file here"
          sublabel=".xlsx or .xls files only"
        />
      ) : (
        <div className="space-y-6">
          <div className="rounded-md border-2 border-black bg-brand-yellow px-4 py-3 text-sm font-semibold text-ink shadow-hard-sm">
            Note: This is a basic conversion. Complex styling, charts, and macros will not be preserved in the PDF output.
          </div>
        
          <Panel title="+--- FILE INFO ---+">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-ink">{file.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-brand-charcoal/70">
                  {formatFileSize(file.size)}
                </p>
                {!processing && !result && (
                  <button
                    onClick={() => {
                      setFile(null)
                    }}
                    className="mt-3 rounded-md border-2 border-black bg-ui px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-ink shadow-hard-sm transition duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-none"
                  >
                    choose a different file
                  </button>
                )}
              </div>
            </div>
          </Panel>

          {processing && <ProgressBar progress={progress} label="Converting spreadsheet..." />}

          {!result ? (
            <Button onClick={convert} disabled={processing} variant="primary">
              <Download className="h-4 w-4" />
              {processing ? 'Converting...' : '[ CONVERT TO PDF ]'}
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button onClick={handleDownload} variant="primary" className="flex-1">
                <Download className="h-4 w-4" />
                [ DOWNLOAD PDF ]
              </Button>
              <button
                onClick={() => {
                  setFile(null)
                  setResult(null)
                  setProgress(0)
                }}
                className="rounded-md border-2 border-black bg-ui px-6 py-3 font-heading font-bold tracking-[0.25em] text-ink uppercase shadow-hard-sm transition duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-md"
              >
                Start Over
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hidden container for HTML rendering */}
      <div 
        ref={hiddenContainerRef} 
        style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '1200px' }}
        aria-hidden="true"
      />

      <ErrorBanner message={error} />
    </ToolPageLayout>
  )
}
