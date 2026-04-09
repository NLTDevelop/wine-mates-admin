export const getImageFileFromPublic = async (imagePath: string, fileName: string): Promise<File> => {
  try {
    const response = await fetch(imagePath)
    if (!response.ok) {
      throw new Error(`Failed to load image: ${response.statusText}`)
    }

    const blob = await response.blob()
    return new File([blob], fileName, { type: blob.type || 'image/jpeg' })
  } catch (error) {
    console.error('Error loading image:', error)
    throw error
  }
}
