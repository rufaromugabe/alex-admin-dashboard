import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Thread } from '@/app/types'
import ThreadConversation from './ThreadConversation'

interface ThreadManagementProps {
  assistantId: string
}

export default function ThreadManagement({ assistantId }: ThreadManagementProps) {
  const [threads, setThreads] = useState<Thread[]>([])
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchThreads()
  }, [assistantId])

  const fetchThreads = async () => {
    try {
      const response = await fetch(`/api/assistants/${assistantId}/threads`)
      if (!response.ok) throw new Error('Failed to fetch threads')
      const data = await response.json()
      setThreads(data.data)
    } catch (error) {
      console.error('Error fetching threads:', error)
      toast.error('Failed to fetch threads. Please try again.')
    }
  }

  const createThread = async () => {
    setIsCreating(true)
    try {
      const response = await fetch(`/api/assistants/${assistantId}/threads`, { method: 'POST' })
      if (!response.ok) throw new Error('Failed to create thread')
      const newThread = await response.json()
      setThreads(prev => [newThread, ...prev])
      setSelectedThread(newThread)
      toast.success('Thread created successfully')
    } catch (error) {
      console.error('Error creating thread:', error)
      toast.error('Failed to create thread. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const deleteThread = async (threadId: string) => {
    try {
      const response = await fetch(`/api/assistants/${assistantId}/threads/${threadId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete thread')
      setThreads(prev => prev.filter(thread => thread.id !== threadId))
      if (selectedThread?.id === threadId) {
        setSelectedThread(null)
      }
      toast.success('Thread deleted successfully')
    } catch (error) {
      console.error('Error deleting thread:', error)
      toast.error('Failed to delete thread. Please try again.')
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={createThread}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        disabled={isCreating}
      >
        {isCreating ? 'Creating...' : 'Create New Thread'}
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Threads</h3>
          <ul className="space-y-2">
            {threads.map((thread) => (
              <li key={thread.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                <button
                  onClick={() => setSelectedThread(thread)}
                  className="text-left flex-grow"
                >
                  Thread {thread.id.slice(-4)}
                </button>
                <button
                  onClick={() => deleteThread(thread.id)}
                  className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          {selectedThread ? (
            <div>
              <h3 className="text-lg font-semibold mb-2">Conversation</h3>
              <ThreadConversation assistantId={assistantId} threadId={selectedThread.id} />
            </div>
          ) : (
            <p className="text-gray-500">Select a thread to view the conversation.</p>
          )}
        </div>
      </div>
    </div>
  )
}

