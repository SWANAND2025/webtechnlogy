import React from 'react'

export default function TabBar({
  activeTab,
  onTabChange,
  onAddClass,
  onOpenAddRelation,
}) {
  return (
    <div className="tab-bar-container">
      <div className="tab-buttons">
        <button
          className={`tab-btn ${activeTab === 'diagram' ? 'active' : ''}`}
          onClick={() => onTabChange('diagram')}
        >
          Diagram
        </button>
        <button
          className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => onTabChange('code')}
        >
          Java Code
        </button>
      </div>

      <div className="tab-actions">
        <button className="btn btn-outline" onClick={onAddClass}>
          + Add Class
        </button>
        <button className="btn btn-outline" onClick={onOpenAddRelation}>
          &harr; Add Relation
        </button>
      </div>
    </div>
  )
}
