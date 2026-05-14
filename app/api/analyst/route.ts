import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic()

type Mode = 'summarize' | 'pivot' | 'report'

interface AnalystRequest {
  mode:         Mode
  entityType?:  string
  entityValue?: string
  context?:     string
}

const SYSTEM_PROMPT = `You are RAVEN, an elite OSINT analyst AI embedded in the Ravenpoint threat intelligence platform.

You analyze cyber threats, actors, infrastructure, and indicators of compromise with precision and depth.

Guidelines:
- Be analytical, direct, and structured
- Use markdown formatting (headers, bullets, bold for key findings)
- Flag high-risk indicators prominently
- Cite your reasoning, not external sources
- Keep responses focused and actionable
- For threat scores, reference the numeric value when discussing severity`

function buildPrompt(req: AnalystRequest): string {
  const entity = req.entityValue
    ? `${req.entityType?.toUpperCase() ?? 'ENTITY'}: ${req.entityValue}`
    : 'the current entity'

  switch (req.mode) {
    case 'summarize':
      return `Provide a concise threat intelligence summary for ${entity}.

${req.context ? `Context data:\n${req.context}` : ''}

Structure your response as:
1. **Executive Summary** (2-3 sentences)
2. **Key Risk Indicators** (bullet list)
3. **Attribution Confidence** (low/medium/high with reasoning)
4. **Recommended Actions**`

    case 'pivot':
      return `Generate pivot suggestions for investigating ${entity}.

${req.context ? `Context data:\n${req.context}` : ''}

Provide:
1. **Immediate Pivots** — direct connections to investigate now
2. **Infrastructure Pivots** — hosting, ASN, registrar correlation paths
3. **Attribution Pivots** — persona, email, wallet, forum correlation paths
4. **OSINT Gaps** — what additional data would change the assessment`

    case 'report':
      return `Write a full OSINT intelligence report for ${entity}.

${req.context ? `Context data:\n${req.context}` : ''}

Report structure:
# OSINT Intelligence Report

## Subject
## Executive Summary
## Technical Infrastructure Analysis
## Threat Actor Assessment
## Timeline of Activity
## Risk Assessment
## Recommended Countermeasures
## Confidence & Limitations`
  }
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  let body: AnalystRequest
  try {
    body = await request.json()
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await client.messages.stream({
          model:      'claude-sonnet-4-6',
          max_tokens: 1024,
          system:     SYSTEM_PROMPT,
          messages:   [{ role: 'user', content: buildPrompt(body) }],
        })

        for await (const chunk of anthropicStream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            const data = JSON.stringify({ text: chunk.delta.text })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Stream error'
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection':    'keep-alive',
    },
  })
}
