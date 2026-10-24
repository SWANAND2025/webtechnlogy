import React from 'react'

export default function Header({ onExportProject, onExportJava }) {
  return (
    <header className="app-header">
      <div className="header-info">
        <h1 className="header-title">UML Class Diagram Generator</h1>
        <p className="header-subtitle">
          Design classes visually and generate Java source code automatically.
        </p>
      </div>
      <div className="header-actions">
        <button className="btn btn-outline" onClick={onExportProject}>
          Export Project
        </button>
        <button className="btn btn-primary" onClick={onExportJava}>
          Export Java
        </button>
      </div>
    </header>
  )
}
