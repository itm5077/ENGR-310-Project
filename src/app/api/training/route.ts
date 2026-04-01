import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { product, location, marketContent } = await req.json();

  if (!product || !location) {
    return NextResponse.json(
      { error: "product and location are required" },
      { status: 400 }
    );
  }

  const prompt = `You are a world-class sales trainer specializing in consultative selling, local market expertise, and real-world pitch coaching.

Using the market intelligence below, build a comprehensive and immediately usable sales training guide for selling **${product}** in **${location}**.

---
MARKET INTELLIGENCE:
${marketContent}
---

## The Perfect Opening Pitch
Write a compelling 45–60 second opening pitch tailored specifically to ${location} customers considering ${product}. Then provide two shorter alternatives:
- **Cold outreach version** (phone/door-to-door)
- **Warm referral version**

All three must reflect local language style and demographic context.

## Top 5 Objections & Proven Responses
For each of the 5 most common objections a ${location} prospect would raise about ${product}:

**Objection:** (exact words the customer might say)
**Why they say this:** (psychological or demographic reason rooted in this specific market)
**Your response:** (word-for-word script — natural, conversational, not robotic)
**Bridge question:** (a follow-up question to move the conversation forward)

## Value Proposition Framework
- The 3 core value propositions that resonate most with this demographic
- How to frame price or ROI for this specific market (what numbers/comparisons work)
- When to lead with emotion vs. logic for this buyer type
- 2–3 specific proof points, case studies, or examples to reference

## Closing Strategies
Three closing techniques that work best for ${location} customers, each with:
- When to use it (the signal to watch for)
- The exact language/script
- How to handle "I need to think about it" or similar stalling

## Local Intelligence & Cultural Tips
- Communication style and pace preferences specific to ${location}
- How to build rapport quickly — what works and what backfires
- Local references, landmarks, or cultural touchstones you can naturally weave in
- Topics or approaches to avoid with this demographic

Write in a coaching tone — direct, practical, and specific. No generic sales advice. Everything should feel tailor-made for this product and this city.`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messageStream = client.messages.stream({
          model: "claude-opus-4-6",
          max_tokens: 4096,
          messages: [{ role: "user", content: prompt }],
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
