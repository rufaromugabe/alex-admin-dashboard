'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import AssistantList from '@/components/AssistantList'
import CreateAssistantForm from '@/components/CreateAssistantForm'
import ThreadManagement from '@/components/ThreadManagement'
import AssistantDetails from '@/components/AssistantDetails'
import { Assistant } from '@/app/types'

export default function Dashboard() {
  const [assistants, setAssistants] = useState<Assistant[]>([])
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [after, setAfter] = useState<string | null>(null)

  useEffect(() => {
    fetchAssistants()
  }, [])

  const fetchAssistants = async (loadMore = false) => {
    try {
      const url = new URL('/api/assistants', window.location.origin)
      if (loadMore && after) {
        url.searchParams.append('after', after)
      }
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch assistants')
      const data = await response.json()
      setAssistants(prev => loadMore ? [...prev, ...data.data] : data.data)
      setHasMore(data.has_more)
      setAfter(data.last_id)
    } catch (error) {
      console.error('Error fetching assistants:', error)
      toast.error('Failed to fetch assistants. Please try again.')
    }
  }

  const handleLoadMore = () => {
    fetchAssistants(true)
  }

  const handleAssistantUpdate = (updatedAssistant: Assistant) => {
    setAssistants(prev => prev.map(a => a.id === updatedAssistant.id ? updatedAssistant : a))
    setSelectedAssistant(updatedAssistant)
    toast.success('Assistant updated successfully')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Assistant Management Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Assistants</h2>
          <AssistantList 
            assistants={assistants} 
            onSelect={setSelectedAssistant}
            onDelete={() => fetchAssistants()}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
          />
          <CreateAssistantForm onCreated={() => fetchAssistants()} />
        </div>
        <div>
          {selectedAssistant ? (
            <>
              <h2 className="text-xl font-semibold mb-2">Assistant Details</h2>
              <AssistantDetails
                assistant={selectedAssistant}
                onUpdate={handleAssistantUpdate}
              />
              <h2 className="text-xl font-semibold mt-4 mb-2">Thread Management</h2>
              <ThreadManagement assistantId={selectedAssistant.id} />
            </>
          ) : (
            <p className="text-gray-500">Select an assistant to view details and manage threads.</p>
          )}
        </div>
      </div>
    </div>
  )
}

