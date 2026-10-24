import React from 'react'
import { makeId } from '../utils/id'

export default function ClassInspector({
  selectedClass,
  onUpdateClass,
  onDeleteClass,
}) {
  if (!selectedClass) {
    return (
      <aside className="class-inspector-sidebar empty-state">
        <h2 className="sidebar-heading">Class Inspector</h2>
        <div className="inspector-empty-message">
          <p>Select a class from the list or canvas to view and edit its attributes and methods.</p>
        </div>
      </aside>
    )
  }

  const handleNameChange = (e) => {
    onUpdateClass(selectedClass.id, { name: e.target.value })
  }

  // Attribute Handlers
  const handleAddAttribute = () => {
    const newAttr = {
      id: makeId('attr'),
      visibility: 'private',
      name: 'newAttr',
      type: 'String',
    }
    onUpdateClass(selectedClass.id, {
      attributes: [...(selectedClass.attributes || []), newAttr],
    })
  }

  const handleUpdateAttribute = (attrId, field, value) => {
    const updated = (selectedClass.attributes || []).map((a) =>
      a.id === attrId ? { ...a, [field]: value } : a
    )
    onUpdateClass(selectedClass.id, { attributes: updated })
  }

  const handleDeleteAttribute = (attrId) => {
    const updated = (selectedClass.attributes || []).filter((a) => a.id !== attrId)
    onUpdateClass(selectedClass.id, { attributes: updated })
  }

  // Method Handlers
  const handleAddMethod = () => {
    const newMethod = {
      id: makeId('meth'),
      visibility: 'public',
      name: 'newMethod',
      returnType: 'void',
    }
    onUpdateClass(selectedClass.id, {
      methods: [...(selectedClass.methods || []), newMethod],
    })
  }

  const handleUpdateMethod = (methId, field, value) => {
    const updated = (selectedClass.methods || []).map((m) =>
      m.id === methId ? { ...m, [field]: value } : m
    )
    onUpdateClass(selectedClass.id, { methods: updated })
  }

  const handleDeleteMethod = (methId) => {
    const updated = (selectedClass.methods || []).filter((m) => m.id !== methId)
    onUpdateClass(selectedClass.id, { methods: updated })
  }

  return (
    <aside className="class-inspector-sidebar">
      <h2 className="sidebar-heading">Class Inspector</h2>

      {/* Class Name */}
      <div className="inspector-field-group">
        <label className="inspector-label">Class name</label>
        <input
          type="text"
          className="inspector-input full-width"
          value={selectedClass.name}
          onChange={handleNameChange}
          placeholder="ClassName"
        />
      </div>

      {/* Attributes Section */}
      <div className="inspector-section">
        <div className="inspector-section-header">
          <span className="section-title">Attributes</span>
          <button
            className="icon-btn-add"
            onClick={handleAddAttribute}
            title="Add Attribute"
          >
            +
          </button>
        </div>

        <div className="member-rows-list">
          {(selectedClass.attributes || []).map((attr) => (
            <div key={attr.id} className="member-input-row">
              <select
                className="inspector-select visibility-select"
                value={attr.visibility || 'private'}
                onChange={(e) => handleUpdateAttribute(attr.id, 'visibility', e.target.value)}
              >
                <option value="private">private</option>
                <option value="public">public</option>
                <option value="protected">protected</option>
              </select>

              <input
                type="text"
                className="inspector-input member-name-input"
                value={attr.name}
                placeholder="name"
                onChange={(e) => handleUpdateAttribute(attr.id, 'name', e.target.value)}
              />

              <input
                type="text"
                className="inspector-input member-type-input"
                value={attr.type}
                placeholder="String"
                onChange={(e) => handleUpdateAttribute(attr.id, 'type', e.target.value)}
              />

              <button
                className="member-delete-btn"
                onClick={() => handleDeleteAttribute(attr.id)}
                title="Delete"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Methods Section */}
      <div className="inspector-section">
        <div className="inspector-section-header">
          <span className="section-title">Methods</span>
          <button
            className="icon-btn-add"
            onClick={handleAddMethod}
            title="Add Method"
          >
            +
          </button>
        </div>

        <div className="member-rows-list">
          {(selectedClass.methods || []).map((meth) => (
            <div key={meth.id} className="member-input-row">
              <select
                className="inspector-select visibility-select"
                value={meth.visibility || 'public'}
                onChange={(e) => handleUpdateMethod(meth.id, 'visibility', e.target.value)}
              >
                <option value="public">public</option>
                <option value="private">private</option>
                <option value="protected">protected</option>
              </select>

              <input
                type="text"
                className="inspector-input member-name-input"
                value={meth.name}
                placeholder="methodName"
                onChange={(e) => handleUpdateMethod(meth.id, 'name', e.target.value)}
              />

              <input
                type="text"
                className="inspector-input member-type-input"
                value={meth.returnType}
                placeholder="void"
                onChange={(e) => handleUpdateMethod(meth.id, 'returnType', e.target.value)}
              />

              <button
                className="member-delete-btn"
                onClick={() => handleDeleteMethod(meth.id)}
                title="Delete"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Class Button */}
      <div className="inspector-footer">
        <button
          className="btn btn-delete-class"
          onClick={() => onDeleteClass(selectedClass.id)}
        >
          Delete Class
        </button>
      </div>
    </aside>
  )
}
