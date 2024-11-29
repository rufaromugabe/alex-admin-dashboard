import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: { assistantId: string, threadId: string } }
) {
  try {
    const response = await fetch(`https://api.openai.com/v1/threads/${params.threadId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    })
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete thread' }, { status: 500 })
  }
}

