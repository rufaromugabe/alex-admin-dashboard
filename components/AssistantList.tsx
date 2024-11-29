import { useState } from 'react'
import { toast } from 'react-toastify'
import { Assistant } from '@/app/types'

interface AssistantListProps {
  assistants: Assistant[]
  onSelect: (assistant: Assistant) => void
  onDelete: () => void
  onLoadMore: () => void
  hasMore: boolean
}

export default function AssistantList({ assistants, onSelect, onDelete, onLoadMore, hasMore }: AssistantListProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (assistantId: string) => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/assistants/${assistantId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete assistant')
      onDelete()
      toast.success('Assistant deleted successfully')
    } catch (error) {
      console.error('Error deleting assistant:', error)
      toast.error('Failed to delete assistant. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <ul className="space-y-2 mb-4">
        {assistants.map((assistant) => (
          <li key={assistant.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
            <span>{assistant.name || 'Unnamed Assistant'}</span>
            <div>
              <button
                onClick={() => onSelect(assistant)}
                className="px-2 py-1 text-sm bg-blue-500 text-white rounded mr-2"
              >
                Select
              </button>
              <button
                onClick={() => handleDelete(assistant.id)}
                className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                disabled={isDeleting}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button
          onClick={onLoadMore}
          className="w-full p-2 bg-gray-200 text-gray-700 rounded"
        >
          Load More
        </button>
      )}
    </div>
  )
}

