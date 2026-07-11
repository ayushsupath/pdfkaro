import { useState } from 'react'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import { Download } from 'lucide-react'
import ToolPageLayout from '../components/shared/ToolPageLayout'
import UploadZone, { ErrorBanner } from '../components/shared/UploadZone'
import ProgressBar from '../components/shared/ProgressBar'
import Button from '../components/shared/Button'
import Panel from '../components/shared/Panel'
import { loadPdfDocument, formatFileSize, validateFile } from '../utils/pdfHelpers'

export default function PdfToWord() {
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [pageCount, setPageCount] = useState(0)

  const handleFile = async (files) => {
    setError(null)
    setResult(null)
    const f = files[0]
    const err = validateFile(f, { types: ['application/pdf'] })
    if (err) {
      setError(err)
      toast.error(err)
      return
    }
    setFile(f)
    
    // Quick check to get page count
    try {
      const doc = await loadPdfDocument(f)
      setPageCount(doc.numPages)
      doc.destroy()
    } catch (e) {
      setError('Could not read PDF. The file may be corrupted or password-protected.')
      setFile(null)
    }
  }

  const convert = async () => {
    if (!file) return
    setProcessing(true)
    setProgress(0)
    setResult(null)
    
    try {
      const doc = await loadPdfDocument(file)
      const numPages = doc.numPages
      const allParagraphs = []
      
      for (let i = 1; i <= numPages; i++) {
        setProgress(Math.round(((i - 1) / numPages) * 70))
        const page = await doc.getPage(i)
        const textContent = await page.getTextContent()
        
        let currentLine = []
        let currentY = null
        
        for (const item of textContent.items) {
          if (!item.str || item.str.trim() === '') {
             if (item.str === ' ') currentLine.push(' ')
             continue
          }
          
          const y = item.transform[5]
          
          if (currentY === null) {
            currentY = y
          }
          
          if (Math.abs(y - currentY) > 5) {
            const lineText = currentLine.join('').trim()
            if (lineText) {
              allParagraphs.push(new Paragraph({
                children: [new TextRun(lineText)]
              }))
            }
            currentLine = [item.str]
            currentY = y
          } else {
            currentLine.push(item.str)
          }
        }
        
        const lastLineText = currentLine.join('').trim()
        if (lastLineText) {
          allParagraphs.push(new Paragraph({
            children: [new TextRun(lastLineText)]
          }))
        }
        
        // Add page break logic if needed, but for basic text extraction, we'll just add an empty paragraph to separate pages
        if (i < numPages) {
          allParagraphs.push(new Paragraph({
            children: [new TextRun("")]
          }))
          allParagraphs.push(new Paragraph({
            children: [new TextRun("--- Page Break ---")]
          }))
          allParagraphs.push(new Paragraph({
            children: [new TextRun("")]
          }))
        }
      }
      
      doc.destroy()
      setProgress(85)
      
      const wordDoc = new Document({
        sections: [
          {
            properties: {},
            children: allParagraphs.length > 0 ? allParagraphs : [new Paragraph({ children: [new TextRun("No text found in PDF.")] })],
          },
        ],
      })
      
      const blob = await Packer.toBlob(wordDoc)
      setProgress(100)
      
      setResult({
        blob,
        name: file.name.replace(/\.pdf$/i, '.docx')
      })
      toast.success('Conversion complete!')
    } catch (e) {
      toast.error('Failed to convert PDF')
      console.error(e)
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      saveAs(result.blob, result.name)
    }
  }

  return (
    <ToolPageLayout
      title="PDF to Word"
      description="Extract text from your PDF into a Word document (.docx). Basic conversion — best for text content."
    >
      {!file ? (
        <UploadZone
          onFiles={handleFile}
          accept="application/pdf"
          label="Drop your PDF here"
          sublabel="PDF files only"
        />
      ) : (
        <div className="space-y-6">
          <div className="rounded-md border-2 border-black bg-brand-yellow px-4 py-3 text-sm font-semibold text-ink shadow-hard-sm">
            Note: This is a basic conversion that extracts text content. Complex formatting, tables, and images may not carry over perfectly.
          </div>
        
          <Panel title="+--- FILE INFO ---+">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-ink">{file.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-brand-charcoal/70">
                  {pageCount} page{pageCount !== 1 ? 's' : ''} • {formatFileSize(file.size)}
                </p>
                {!processing && !result && (
                  <button
                    onClick={() => {
                      setFile(null)
                      setPageCount(0)
                    }}
                    className="mt-3 rounded-md border-2 border-black bg-ui px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-ink shadow-hard-sm transition duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-none"
                  >
                    choose a different file
                  </button>
                )}
              </div>
            </div>
          </Panel>

          {processing && <ProgressBar progress={progress} label="Extracting text..." />}

          {!result ? (
            <Button onClick={convert} disabled={processing} variant="primary">
              <Download className="h-4 w-4" />
              {processing ? 'Converting...' : '[ CONVERT TO WORD ]'}
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button onClick={handleDownload} variant="primary" className="flex-1">
                <Download className="h-4 w-4" />
                [ DOWNLOAD WORD DOC ]
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

      <ErrorBanner message={error} />
    </ToolPageLayout>
  )
}
