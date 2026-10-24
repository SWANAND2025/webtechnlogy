import JSZip from 'jszip'

export function downloadText(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportProjectJson(classes, relationships) {
  const projectData = {
    version: '1.0',
    name: 'UML Class Diagram Project',
    timestamp: new Date().toISOString(),
    classes,
    relationships,
  }
  const jsonStr = JSON.stringify(projectData, null, 2)
  downloadText('uml_diagram_project.json', jsonStr)
}

export async function exportJavaZip(classes, relationships, codeText) {
  const zip = new JSZip()
  const srcFolder = zip.folder('src')

  // Put combined file
  srcFolder.file('AllClasses.java', codeText)

  // Put individual class files
  classes.forEach((cls) => {
    const singleClassCode = `// Generated for class ${cls.name}\n${codeText
      .split('\n\n')
      .find((chunk) => chunk.includes(`class ${cls.name}`)) || ''}`
    srcFolder.file(`${cls.name}.java`, singleClassCode.trim() + '\n')
  })

  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'generated_java_sources.zip'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
