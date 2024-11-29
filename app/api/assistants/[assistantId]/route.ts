import { NextResponse } from 'next/server'

export async function DELETE(request: Request, { params }: { params: { assistantId: string } }) {
  try {
    const response = await fetch(`https://api.openai.com/v1/assistants/${params.assistantId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    })
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete assistant' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { assistantId: string } }) {
  try {
    const body = await request.json()
    const response = await fetch(`https://api.openai.com/v1/assistants/${params.assistantId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update assistant' }, { status: 500 })
  }
}

