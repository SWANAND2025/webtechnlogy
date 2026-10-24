import React, { useState } from 'react'
import {
  generateUMLJavaCode,
  generateStandardJavaCode,
} from '../utils/javaGenerator'
import { downloadText } from '../utils/exportUtils'

export default function JavaCodeView({ classes, relationships }) {
  const [formatMode, setFormatMode] = useState('uml') // 'uml' or 'standard'
  const [includeExtends, setIncludeExtends] = useState(false)
  const [copied, setCopied] = useState(false)

  const codeText =
    formatMode === 'uml'
      ? generateUMLJavaCode(classes, relationships, includeExtends)
      : generateStandardJavaCode(classes, relationships)

  const handleDownload = () => {
    downloadText('GeneratedUmlClasses.java', codeText)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="java-code-view-container">
      <div className="code-view-header">
        <div className="code-view-title-group">
          <h2 className="code-view-title">Generated Java</h2>
          <div className="code-view-controls">
            <div className="format-toggle">
              <button
                className={`toggle-option ${formatMode === 'uml' ? 'active' : ''}`}
                onClick={() => setFormatMode('uml')}
              >
                UML Format
              </button>
              <button
                className={`toggle-option ${formatMode === 'standard' ? 'active' : ''}`}
                onClick={() => setFormatMode('standard')}
              >
                Standard Java
              </button>
            </div>

            {formatMode === 'uml' && (
              <label className="extends-checkbox-label">
                <input
                  type="checkbox"
                  checked={includeExtends}
                  onChange={(e) => setIncludeExtends(e.target.checked)}
                />
                Apply inheritance (extends)
              </label>
            )}
          </div>
        </div>

        <div className="code-view-actions">
          <button className="btn btn-outline-sm" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
          <button className="btn btn-primary" onClick={handleDownload}>
            Download .java
          </button>
        </div>
      </div>

      <div className="code-editor-block">
        <pre className="code-pre">
          <code>{codeText}</code>
        </pre>
      </div>
    </div>
  )
}
