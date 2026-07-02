# 📄 PDFKaro

**Free. Private. No Login. Just Kaam Ho Jaye.**

PDFKaro is a completely free, browser-based PDF toolkit — convert, merge, split, and digitally sign your PDFs without ever uploading a file to a server. No sign-up, no watermarks, no limits.

![No Login](https://img.shields.io/badge/Login-Not%20Required-brightgreen)
![Privacy](https://img.shields.io/badge/Privacy-100%25%20Client--Side-blue)
![Free](https://img.shields.io/badge/Price-Free%20Forever-orange)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## ✨ Why PDFKaro?

Most online PDF tools upload your files to a server before processing them — that means your personal, financial, or confidential documents pass through someone else's system.

**PDFKaro is different.** Every single operation — converting, merging, splitting, or signing — happens **entirely inside your browser**. Your files are read, processed, and downloaded locally. They never touch a server, and they're never stored anywhere.

| | PDFKaro | Typical Online Tools |
|---|---|---|
| 🔒 File Privacy | Never leaves your device | Uploaded to a server |
| 🔑 Login Required | ❌ No | ✅ Usually yes |
| 💰 Cost | 100% Free | Freemium / Paid tiers |
| 🚫 Watermarks | None | Often added |
| ⚡ Speed | Instant (no upload/download wait) | Depends on server load |
| 📶 Offline Use | ✅ Works as a PWA | ❌ Needs internet |

---

## 🚀 Features

### Core Tools
- 🖼️ **JPG/PNG to PDF** — combine multiple images into one PDF, reorder with drag-and-drop
- 📑 **PDF to JPG** — export every page as a high-quality image
- 🔗 **Merge PDF** — combine multiple PDFs into a single file
- ✂️ **Split PDF** — extract or separate specific pages
- ✍️ **Digital Signature** — draw, type, or upload your signature and place it anywhere on a PDF

### Coming Soon
- 📝 Word ↔ PDF
- 📊 Excel ↔ PDF
- 📽️ PowerPoint to PDF
- 🗜️ Compress PDF
- 🔄 Rotate PDF
- 🔐 Password Protect / Unlock PDF
- 💧 Add Watermark / Page Numbers

---

## 🖊️ Digital Signature — Flagship Feature

Sign any PDF in seconds, right from your browser:

1. **Draw** your signature freehand
2. **Type** your name in an elegant handwriting-style font
3. **Upload** an image of your signature (background auto-removed)
4. **Save** it locally for quick reuse next time
5. **Drag, resize, and place** it anywhere on your document
6. **Download** the signed PDF — no watermark, no trace

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **PDF Engine:** `pdf-lib`, `pdf.js`, `jsPDF`
- **File Handling:** `SheetJS`, `mammoth.js`, `html2canvas`, `file-saver`
- **Signature:** `react-signature-canvas`
- **PWA:** Offline support via `vite-plugin-pwa`

> No backend. No database. No API calls with your files — everything runs client-side.

---

## 📦 Getting Started

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/pdfkaro.git

# Navigate to the project folder
cd pdfkaro

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to see it running.

---

## 📁 Project Structure

```
pdfkaro/
├── src/
│   ├── components/
│   │   ├── layout/       # Header, Footer, Theme Toggle
│   │   ├── shared/       # Upload Zone, File Card, Progress Bar
│   │   └── signature/    # Draw, Type, Upload signature components
│   ├── pages/            # Individual tool pages
│   ├── utils/            # PDF & file processing helpers
│   ├── App.jsx
│   └── main.jsx
├── public/
├── tailwind.config.js
└── vite.config.js
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to add a new tool, fix a bug, or improve the UI:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — free to use, modify, and distribute.

---

## 💬 Feedback

Found a bug or have a feature request? Open an [issue](https://github.com/YOUR-USERNAME/pdfkaro/issues) — feedback is always welcome!

---

<p align="center">Made with ❤️ for a simpler, more private internet.</p>
