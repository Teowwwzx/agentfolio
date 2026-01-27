
'use client'

import { useState } from 'react'
import { PageSection, deleteSection } from '@/actions/sections'
import SectionForm from './SectionForm'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash, Move } from 'lucide-react'

type Props = {
  sections: PageSection[]
  options: {
    categories: { id: string; name: string }[]
    tags: { id: string; name: string }[]
  }
}

export default function SectionsClient({ sections, options }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<PageSection | undefined>(undefined)

  const handleCreate = () => {
    setEditingSection(undefined)
    setIsModalOpen(true)
  }

  const handleEdit = (section: PageSection) => {
    setEditingSection(section)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      await deleteSection(id)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Homepage Sections</h1>
        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus size={16} /> Add Section
        </Button>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div 
            key={section.id} 
            className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-100 rounded text-slate-400 cursor-move">
                <Move size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{section.title}</h3>
                <p className="text-sm text-slate-500">
                  Type: <span className="capitalize">{section.section_type}</span> • 
                  Layout: <span className="capitalize">{section.layout_type.replace('_', ' ')}</span>
                  {!section.is_active && <span className="ml-2 text-red-500 font-medium">(Inactive)</span>}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(section)}>
                <Edit size={14} />
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(section.id)}>
                <Trash size={14} />
              </Button>
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
            No sections configured. The homepage will show default content.
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingSection ? "Edit Section" : "Add New Section"}
      >
        <SectionForm 
          initialData={editingSection} 
          options={options} 
          onClose={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  )
}
