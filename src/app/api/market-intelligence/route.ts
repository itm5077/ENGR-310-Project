import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { product, location } = await req.json();

  if (!product || !location) {
    return NextResponse.json(
      { error: "product and location are required" },
      { status: 400 }
    );
  }

  const prompt = `You are a senior market research analyst specializing in local competitive intelligence.

Generate a comprehensive market intelligence report for selling **${product}** in **${location}**.

## Competitor Landscape
Identify 4–6 key competitors selling similar products or services in ${location}. For each:
- **Company name** and one-line description
- **Price positioning** (budget / mid-market / premium) with estimated price range
- **2 key strengths** and **2 key weaknesses**
- **Primary target customer**

## Local Economic Context
- Current economic climate, employment trends, and GDP/growth indicators for ${location}
- Median household income and consumer spending power relevant to ${product}
- Key industries and employers driving local income
- Recent economic developments (last 12–18 months) that affect purchasing decisions

## Demographic Profile
- Age cohorts and lifestyle segments most likely to buy ${product} in this market
- Cultural characteristics, values, and priorities that shape purchase decisions
- Local buying behavior patterns (e.g. online vs. in-store, trust signals, decision timeline)
- Any relevant cultural or community nuances specific to ${location}

## Market Opportunities & Gaps
- Underserved customer segments or unmet needs among current competitors
- Seasonal demand patterns or timing considerations
- Emerging trends in ${location} that create openings for ${product}

## Recommended Competitive Positioning
Based on the above, list 4–5 specific competitive advantages a salesperson should emphasize when selling ${product} in ${location}. Be direct and actionable.

Use concrete examples and realistic figures. Write for a salesperson, not an academic.`;

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
