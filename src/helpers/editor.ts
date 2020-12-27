import { saveAs } from 'file-saver'

function countWords(text: string) {
  return text.split(/\s+/).length
}

function downloadAs(fileName: string, fileContent: string) {
  const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, fileName)
}

export { countWords, downloadAs }
