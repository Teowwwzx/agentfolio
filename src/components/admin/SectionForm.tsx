
'use client'

import { useState } from 'react'
import { PageSection } from '@/actions/sections'
import { createSection, updateSection } from '@/actions/sections'
import { Button } from '@/components/ui/button'

type Props = {
  initialData?: PageSection
  options: {
    categories: { id: string; name: string }[]
    tags: { id: string; name: string }[]
  }
  onClose: () => void
}

export default function SectionForm({ initialData, options, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [sectionType, setSectionType] = useState(initialData?.section_type || 'latest')
  
  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      if (initialData) {
        await updateSection(initialData.id, formData)
      } else {
        await createSection(formData)
      }
      onClose()
    } catch (error) {
      console.error(error)
      alert('Failed to save section')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Section Title</label>
        <input
          name="title"
          defaultValue={initialData?.title}
          required
          className="w-full p-2 border rounded-md"
          placeholder="e.g. Featured Properties"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Content Source</label>
          <select
            name="section_type"
            value={sectionType}
            onChange={(e) => setSectionType(e.target.value as any)}
            className="w-full p-2 border rounded-md"
          >
            <option value="latest">Latest Properties</option>
            <option value="featured">Featured (All)</option>
            <option value="category">By Category</option>
            <option value="tag">By Tag</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">View Layout</label>
          <select
            name="layout_type"
            defaultValue={initialData?.layout_type || 'grid_3'}
            className="w-full p-2 border rounded-md"
          >
            <option value="grid_3">Grid (3 cards/row)</option>
            <option value="list_1">List (1 card/row)</option>
            <option value="carousel">Carousel</option>
            <option value="hero_grid">Hero Grid (1 Big + 3 Grid)</option>
          </select>
        </div>
      </div>

      {sectionType === 'category' && (
        <div>
          <label className="block text-sm font-medium mb-1">Select Category</label>
          <select
            name="category_id"
            defaultValue={initialData?.filter_config?.category_id}
            required
            className="w-full p-2 border rounded-md"
          >
            <option value="">-- Select Category --</option>
            {options.categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {sectionType === 'tag' && (
        <div>
          <label className="block text-sm font-medium mb-1">Select Tag</label>
          <select
            name="tag_id"
            defaultValue={initialData?.filter_config?.tag_id}
            required
            className="w-full p-2 border rounded-md"
          >
            <option value="">-- Select Tag --</option>
            {options.tags.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Limit (Max Items)</label>
        <input
          type="number"
          name="limit"
          defaultValue={initialData?.filter_config?.limit || 6}
          min="1"
          max="20"
          className="w-full p-2 border rounded-md"
        />
      </div>

      {initialData && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={initialData.is_active}
            id="is_active"
          />
          <label htmlFor="is_active" className="text-sm">Active</label>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (initialData ? 'Update Section' : 'Create Section')}
        </Button>
      </div>
    </form>
  )
}
