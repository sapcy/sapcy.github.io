import { NextRequest, NextResponse } from 'next/server'
import { sealSecrets } from '@sapcy/web-sealedsecret/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation
    if (!body.publicKey) {
      return NextResponse.json(
        { error: 'Public key is required' },
        { status: 400 }
      )
    }

    if (!body.data || Object.keys(body.data).length === 0) {
      return NextResponse.json(
        { error: 'Data is required' },
        { status: 400 }
      )
    }

    // Use web-sealedsecret API
    const result = sealSecrets({
      publicKey: body.publicKey,
      data: body.data,
      namespace: body.namespace,
      name: body.name,
    })

    return NextResponse.json(result)
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' })
}
