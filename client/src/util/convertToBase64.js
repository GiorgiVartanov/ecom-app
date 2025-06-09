const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(null)
    reader.readAsDataURL(file)
  })
}

export default convertToBase64
