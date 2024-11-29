import { useState } from 'react'
import { Assistant } from '@/app/types'

interface AssistantDetailsProps {
  assistant: Assistant
  onUpdate: (updatedAssistant: Assistant) => void
}

export default function AssistantDetails({ assistant, onUpdate }: AssistantDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(assistant.name)
  const [instructions, setInstructions] = useState(assistant.instructions || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/assistants/${assistant.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, instructions }),
      })
      if (!response.ok) throw new Error('Failed to update assistant')
      const updatedAssistant = await response.json()
      onUpdate(updatedAssistant)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating assistant:', error)
    }
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions</label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></textarea>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Name</h3>
        <p className="mt-1 text-sm text-gray-500">{assistant.name}</p>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900">Model</h3>
        <p className="mt-1 text-sm text-gray-500">{assistant.model}</p>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900">Instructions</h3>
        <p className="mt-1 text-sm text-gray-500">{assistant.instructions || 'No instructions provided'}</p>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900">Created At</h3>
        <p className="mt-1 text-sm text-gray-500">{new Date(assistant.created_at * 1000).toLocaleString()}</p>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Edit
      </button>
    </div>
  )
}

