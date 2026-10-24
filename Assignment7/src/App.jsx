import React, { useState } from 'react'
import Header from './components/Header'
import TabBar from './components/TabBar'
import ClassListSidebar from './components/ClassListSidebar'
import Canvas from './components/Canvas'
import ClassInspector from './components/ClassInspector'
import JavaCodeView from './components/JavaCodeView'
import AddRelationModal from './components/AddRelationModal'
import { INITIAL_CLASSES, INITIAL_RELATIONSHIPS } from './data/initialState'
import { makeId } from './utils/id'
import { exportProjectJson, exportJavaZip } from './utils/exportUtils'
import { generateStandardJavaCode } from './utils/javaGenerator'

export default function App() {
  const [classes, setClasses] = useState(INITIAL_CLASSES)
  const [relationships, setRelationships] = useState(INITIAL_RELATIONSHIPS)
  const [selectedClassId, setSelectedClassId] = useState('cls_person')
  const [activeTab, setActiveTab] = useState('diagram') // 'diagram' | 'code'
  const [isAddRelationOpen, setIsAddRelationOpen] = useState(false)

  // Selected class helper
  const selectedClass = classes.find((c) => c.id === selectedClassId) || null

  // Class Management
  const handleAddClass = () => {
    const nextIdx = classes.length + 1
    const newClass = {
      id: makeId('cls'),
      name: `Class${nextIdx}`,
      x: 80 + (nextIdx % 4) * 220,
      y: 100 + Math.floor(nextIdx / 4) * 180,
      headerBg: '#f1f5f9',
      attributes: [
        { id: makeId('attr'), visibility: 'private', name: 'id', type: 'int' },
      ],
      methods: [
        { id: makeId('meth'), visibility: 'public', name: 'getId', returnType: 'int' },
      ],
    }
    setClasses((prev) => [...prev, newClass])
    setSelectedClassId(newClass.id)
    if (activeTab !== 'diagram') setActiveTab('diagram')
  }

  const handleUpdateClass = (classId, updates) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, ...updates } : c))
    )
  }

  const handleDeleteClass = (classId) => {
    const remaining = classes.filter((c) => c.id !== classId)
    setClasses(remaining)
    setRelationships((prev) =>
      prev.filter((r) => r.sourceId !== classId && r.targetId !== classId)
    )
    if (selectedClassId === classId) {
      setSelectedClassId(remaining.length > 0 ? remaining[0].id : null)
    }
  }

  const handleMoveClass = (classId, x, y) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, x, y } : c))
    )
  }

  // Relationship Management
  const handleAddRelationship = (rel) => {
    setRelationships((prev) => [...prev, rel])
  }

  const handleDeleteRelationship = (relId) => {
    setRelationships((prev) => prev.filter((r) => r.id !== relId))
  }

  // Export handlers
  const handleExportProject = () => {
    exportProjectJson(classes, relationships)
  }

  const handleExportJava = () => {
    const code = generateStandardJavaCode(classes, relationships)
    exportJavaZip(classes, relationships, code)
  }

  return (
    <div className="app-root">
      <Header
        onExportProject={handleExportProject}
        onExportJava={handleExportJava}
      />

      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddClass={handleAddClass}
        onOpenAddRelation={() => setIsAddRelationOpen(true)}
      />

      <main className="app-main-content">
        {activeTab === 'diagram' ? (
          <div className="diagram-workspace">
            <ClassListSidebar
              classes={classes}
              selectedClassId={selectedClassId}
              onSelectClass={setSelectedClassId}
            />

            <Canvas
              classes={classes}
              relationships={relationships}
              selectedClassId={selectedClassId}
              onSelectClass={setSelectedClassId}
              onMoveClass={handleMoveClass}
              onDeleteRelationship={handleDeleteRelationship}
            />

            <ClassInspector
              selectedClass={selectedClass}
              onUpdateClass={handleUpdateClass}
              onDeleteClass={handleDeleteClass}
            />
          </div>
        ) : (
          <div className="code-workspace">
            <JavaCodeView
              classes={classes}
              relationships={relationships}
            />
          </div>
        )}
      </main>

      <AddRelationModal
        classes={classes}
        isOpen={isAddRelationOpen}
        onClose={() => setIsAddRelationOpen(false)}
        onAddRelationship={handleAddRelationship}
      />
    </div>
  )
}
