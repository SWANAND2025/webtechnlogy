import React from 'react'
import { getVisibilitySymbol } from '../utils/javaGenerator'

export default function ClassNode({
  cls,
  isSelected,
  onSelect,
  onMouseDown,
}) {
  const defaultHeaderBg = cls.name.toLowerCase().includes('student')
    ? '#ecfdf5'
    : '#e0f2fe'
  const headerBg = cls.headerBg || defaultHeaderBg

  return (
    <div
      className={`uml-class-card ${isSelected ? 'selected' : ''}`}
      style={{
        left: `${cls.x}px`,
        top: `${cls.y}px`,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(cls.id)
      }}
      onMouseDown={(e) => onMouseDown(e, cls.id)}
    >
      <div
        className="uml-card-header"
        style={{ backgroundColor: headerBg }}
      >
        <span className="uml-card-name">{cls.name}</span>
      </div>

      <div className="uml-card-section attributes-section">
        {cls.attributes && cls.attributes.length > 0 ? (
          cls.attributes.map((attr) => (
            <div key={attr.id} className="uml-member-line">
              <span className="uml-member-symbol">
                {getVisibilitySymbol(attr.visibility)}
              </span>{' '}
              {attr.name}: {attr.type}
            </div>
          ))
        ) : (
          <div className="uml-empty-line">&nbsp;</div>
        )}
      </div>

      <div className="uml-card-section methods-section">
        {cls.methods && cls.methods.length > 0 ? (
          cls.methods.map((meth) => (
            <div key={meth.id} className="uml-member-line">
              <span className="uml-member-symbol">
                {getVisibilitySymbol(meth.visibility)}
              </span>{' '}
              {meth.name}(): {meth.returnType}
            </div>
          ))
        ) : (
          <div className="uml-empty-line">&nbsp;</div>
        )}
      </div>
    </div>
  )
}
