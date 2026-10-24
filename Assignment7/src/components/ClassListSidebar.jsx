import React from 'react'

export default function ClassListSidebar({
  classes,
  selectedClassId,
  onSelectClass,
}) {
  return (
    <aside className="class-list-sidebar">
      <h2 className="sidebar-heading">Classes</h2>

      <div className="class-items-list">
        {classes.map((cls) => {
          const isSelected = cls.id === selectedClassId
          return (
            <div
              key={cls.id}
              className={`class-list-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectClass(cls.id)}
            >
              <span className="class-item-dot">&#9679;</span>
              <span className="class-item-name">{cls.name}</span>
            </div>
          )
        })}
      </div>

      <div className="how-to-use-card">
        <h4 className="how-to-use-title">How to use</h4>
        <p className="how-to-use-text">
          Select a class, edit its members on the right, then add relationships.
        </p>
      </div>
    </aside>
  )
}
