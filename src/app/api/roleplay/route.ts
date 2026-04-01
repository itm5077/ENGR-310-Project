import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface Message {
  role: "user" | "assistant";
  content: string;
  isHidden?: boolean;
}

export async function POST(req: NextRequest) {
  const { product, location, marketContent, trainingContent, messages } =
    await req.json();

  if (!product || !location || !messages?.length) {
    return NextResponse.json(
      { error: "product, location, and messages are required" },
      { status: 400 }
    );
  }

  // Build a rich customer persona from the market + training context
  const systemPrompt = `You are roleplaying as a realistic potential customer from ${location} who is considering purchasing ${product}. This is a sales training simulation.

CUSTOMER CONTEXT (derived from local market research):
${marketContent.slice(0, 2500)}

COMMON OBJECTIONS FOR THIS MARKET (use these naturally):
${trainingContent.slice(0, 1500)}

YOUR CHARACTER:
- You are a real, grounded person from ${location} with genuine skepticism about this purchase
- You have done basic online research but are not an expert — you have surface-level knowledge
- You have 2–3 specific objections you will raise naturally at appropriate moments (price, alternatives, timing, need validation, or trust)
- You respond positively and become more engaged when you genuinely feel understood or when value is clearly demonstrated
- You respond negatively to high-pressure tactics, vague claims, or generic pitches
- You ask clarifying questions a real buyer would ask
- Occasionally reference local context (a local neighborhood, employer, lifestyle detail relevant to ${location})
- Your tone is conversational and natural — you're not hostile, just appropriately guarded

CONVERSATION RULES:
- NEVER break character or acknowledge you are an AI or a simulation
- Keep every response to 2–4 sentences — natural and conversational
- React realistically: show interest, curiosity, hesitation, or skepticism as the conversation warrants
- If the salesperson handles an objection well, soften your stance on that point (but you may raise a new concern)
- If the salesperson is pushy, evasive, or generic, push back or disengage slightly
- You are the CUSTOMER being sold to — never play the salesperson role`;

  // Strip the isHidden flag — pass only role/content to the API
  const apiMessages = messages.map(({ role, content }: Message) => ({
    role,
    content,
  }));

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messageStream = client.messages.stream({
          model: "claude-opus-4-6",
          max_tokens: 512,
          system: systemPrompt,
          messages: apiMessages,
        });

        for await (const event of messageStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
