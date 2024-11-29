import { useState } from 'react'
import { toast } from 'react-toastify'

// ... (previous code remains the same)
interface CreateAssistantFormProps {
  onCreated: () => void
}

export default function CreateAssistantForm({ onCreated }: CreateAssistantFormProps) {
  // ... (state declarations remain the same)
  const [name, setName] = useState('')
  const [model, setModel] = useState('gpt-4o')
  const [isCreating, setIsCreating] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      const response = await fetch('/api/assistants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, model }),
      })
      if (!response.ok) throw new Error('Failed to create assistant')
      onCreated()
      setName('')
      toast.success('Assistant created successfully')
    } catch (error) {
      console.error('Error creating assistant:', error)
      toast.error('Failed to create assistant. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  // ... (rest of the component remains the same)
  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Assistant Name"
        className="w-full p-2 border rounded"
        required
      />
      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="gpt-4o">GPT-4o</option>
        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
      </select>
      <button
        type="submit"
        className="w-full p-2 bg-green-500 text-white rounded"
        disabled={isCreating}
      >
        {isCreating ? 'Creating...' : 'Create Assistant'}
      </button>
    </form>
  )
}

