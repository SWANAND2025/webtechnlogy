import React, { useRef, useState } from 'react'
import ClassNode from './ClassNode'

export default function Canvas({
  classes,
  relationships,
  selectedClassId,
  onSelectClass,
  onMoveClass,
  onDeleteRelationship,
}) {
  const canvasRef = useRef(null)
  const [draggingClassId, setDraggingClassId] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e, classId) => {
    // Only drag with left click and when not interacting with inputs
    if (e.button !== 0) return
    const cls = classes.find((c) => c.id === classId)
    if (!cls) return

    const rect = canvasRef.current.getBoundingClientRect()
    setDraggingClassId(classId)
    setDragOffset({
      x: e.clientX - rect.left - cls.x,
      y: e.clientY - rect.top - cls.y,
    })
    onSelectClass(classId)
  }

  const handleMouseMove = (e) => {
    if (!draggingClassId || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const newX = Math.max(20, Math.round((e.clientX - rect.left - dragOffset.x) / 10) * 10)
    const newY = Math.max(20, Math.round((e.clientY - rect.top - dragOffset.y) / 10) * 10)
    onMoveClass(draggingClassId, newX, newY)
  }

  const handleMouseUp = () => {
    setDraggingClassId(null)
  }

  const handleCanvasClick = (e) => {
    // If click directly on canvas background
    if (e.target === canvasRef.current || e.target.classList.contains('canvas-grid-layer')) {
      onSelectClass(null)
    }
  }

  // Find class names for relationships
  const enrichedRelations = relationships.map((rel) => {
    const source = classes.find((c) => c.id === rel.sourceId)
    const target = classes.find((c) => c.id === rel.targetId)
    return {
      ...rel,
      sourceName: source ? source.name : 'Unknown',
      targetName: target ? target.name : 'Unknown',
      sourceX: source ? source.x : 0,
      sourceY: source ? source.y : 0,
      targetX: target ? target.x : 0,
      targetY: target ? target.y : 0,
    }
  })

  return (
    <div
      ref={canvasRef}
      className="canvas-container"
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="canvas-grid-layer">
        {/* Render Class Nodes */}
        {classes.map((cls) => (
          <ClassNode
            key={cls.id}
            cls={cls}
            isSelected={cls.id === selectedClassId}
            onSelect={onSelectClass}
            onMouseDown={handleMouseDown}
          />
        ))}

        {/* Bottom Relationship Summary Cards (as shown in Screenshots 1 & 2) */}
        {enrichedRelations.length > 0 && (
          <div className="relationships-summary-container">
            {enrichedRelations.map((rel) => (
              <div key={rel.id} className="relationship-summary-badge">
                <span className="rel-arrow-icon">&#8627;</span>
                <span className="rel-source-name">{rel.sourceName}</span>
                <span className="rel-dash">&mdash;</span>
                <span className="rel-type-text">{rel.type || 'extends'}</span>
                <span className="rel-arrow">&rarr;</span>
                <span className="rel-target-name">{rel.targetName}</span>
                <span className="rel-pill-tag">{rel.label || rel.type || 'extends'}</span>
                {onDeleteRelationship && (
                  <button
                    className="rel-delete-btn"
                    title="Remove Relationship"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteRelationship(rel.id)
                    }}
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
