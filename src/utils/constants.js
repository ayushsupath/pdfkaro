export const TOOLS = [
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    description: 'Combine images into a single PDF. Reorder with drag & drop.',
    path: '/jpg-to-pdf',
    icon: 'ImagePlus',
    phase: 1,
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    description: 'Convert each PDF page into a downloadable image.',
    path: '/pdf-to-jpg',
    icon: 'FileImage',
    phase: 1,
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into one document.',
    path: '/merge-pdf',
    icon: 'Combine',
    phase: 1,
    color: 'from-indigo-500 to-blue-600',
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Extract pages or split into individual files.',
    path: '/split-pdf',
    icon: 'Scissors',
    phase: 1,
    color: 'from-teal-500 to-emerald-600',
  },
  {
    id: 'sign-pdf',
    name: 'Sign PDF',
    description: 'Draw, type, or upload your signature. Our flagship tool.',
    path: '/sign-pdf',
    icon: 'PenLine',
    phase: 1,
    color: 'from-orange-500 to-amber-600',
    featured: true,
  },
]

export const TRUST_BADGES = [
  { icon: '🔒', text: 'No Login Required' },
  { icon: '⚡', text: '100% Free' },
  { icon: '🛡️', text: 'Files Never Leave Your Device' },
]

export const SIGNATURE_FONTS = [
  { id: 'signature-1', name: 'Dancing Script', className: 'font-signature-1' },
  { id: 'signature-2', name: 'Great Vibes', className: 'font-signature-2' },
  { id: 'signature-3', name: 'Sacramento', className: 'font-signature-3' },
  { id: 'signature-4', name: 'Allura', className: 'font-signature-4' },
  { id: 'signature-5', name: 'Pacifico', className: 'font-signature-5' },
]
