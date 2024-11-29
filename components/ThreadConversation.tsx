import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Message } from '@/app/types'

interface ThreadConversationProps {
  assistantId: string
  threadId: string
}

export default function ThreadConversation({ assistantId, threadId }: ThreadConversationProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [assistantId, threadId])

  const fetchMessages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/assistants/${assistantId}/threads/${threadId}/messages`)
      if (!response.ok) throw new Error('Failed to fetch messages')
      const data = await response.json()
      setMessages(data.data.reverse())
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('Failed to fetch messages. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/assistants/${assistantId}/threads/${threadId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      })
      if (!response.ok) throw new Error('Failed to send message')
      setNewMessage('')
      fetchMessages()
      toast.success('Message sent successfully')
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="h-96 overflow-y-auto border rounded p-4 space-y-2">
        {isLoading && <p className="text-center">Loading...</p>}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 rounded ${
              message.role === 'user' ? 'bg-blue-100 ml-8' : 'bg-gray-100 mr-8'
            }`}
          >
            <p className="text-sm font-semibold">{message.role}</p>
            <p>{message.content[0].text.value}</p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-2 border rounded"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
        >
          Send
        </button>
      </form>
    </div>
  )
}

