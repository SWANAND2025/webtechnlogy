import React, { useState } from 'react'
import { makeId } from '../utils/id'

export default function AddRelationModal({
  classes,
  isOpen,
  onClose,
  onAddRelationship,
}) {
  if (!isOpen) return null

  const [sourceId, setSourceId] = useState(classes[1]?.id || classes[0]?.id || '')
  const [targetId, setTargetId] = useState(classes[0]?.id || '')
  const [relType, setRelType] = useState('extends')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!sourceId || !targetId) {
      alert('Please select both source and target classes.')
      return
    }
    if (sourceId === targetId) {
      alert('Source and target classes must be different.')
      return
    }

    onAddRelationship({
      id: makeId('rel'),
      sourceId,
      targetId,
      type: relType,
      label: relType,
    })
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Add UML Relationship</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Source Class (From)</label>
              <select
                className="form-select"
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Relationship Type</label>
              <select
                className="form-select"
                value={relType}
                onChange={(e) => setRelType(e.target.value)}
              >
                <option value="extends">extends (Inheritance)</option>
                <option value="implements">implements (Realization)</option>
                <option value="association">association (Association)</option>
                <option value="aggregation">aggregation (Aggregation)</option>
                <option value="composition">composition (Composition)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Class (To)</label>
              <select
                className="form-select"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Relationship
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
