import { useCallback } from 'react'
import UploadZone from '../shared/UploadZone'
import { removeWhiteBackground } from '../../utils/imageHelpers'

export default function UploadSignature({ onSignatureReady }) {
  const handleFiles = useCallback(
    async (files) => {
      const file = files[0]
      if (!file?.type.startsWith('image/')) return

      const reader = new FileReader()
      reader.onload = async () => {
        const cleaned = await removeWhiteBackground(reader.result)
        onSignatureReady(cleaned)
      }
      reader.readAsDataURL(file)
    },
    [onSignatureReady]
  )

  return (
    <div>
      <UploadZone
        onFiles={handleFiles}
        accept="image/png,image/jpeg,image/webp"
        multiple={false}
        label="Upload signature image"
        sublabel="PNG or JPG — white background will be removed"
      />
    </div>
  )
}
