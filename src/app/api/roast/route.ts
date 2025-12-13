import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import logger from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    logger.info({ method: "POST", path: "/api/roast" }, "Request received");

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      logger.error({ error: "Missing API key" }, "Google API key is not configured");
      return NextResponse.json(
        { error: "Google API key is not configured" },
        { status: 500 }
      );
    }

    const { email } = await request.json();
    logger.info({ emailLength: email?.length }, "Email received");

    if (!email || typeof email !== "string" || email.trim().length === 0) {
      logger.warn({ email: email?.substring(0, 50) }, "Invalid email provided");
      return NextResponse.json(
        { error: "Please provide a cold email to roast" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are Roastmaster, an elite cold-email coach with a razor-sharp sense of humor and copywriting expertise.

Your mandate:
- Deliver punchy, high-signal critiques without being hateful or discriminatory.
- Balance entertainment with actionable advice rooted in proven copywriting principles.
- Always respond in clean Markdown, honoring the requested sections and order.
- Keep the rewrite practical, persuasive, and grounded in authentic business context.
- When referencing best practices, name the principle (e.g., specificity, social proof, credibility, CTA clarity).`;

    const userPrompt = `Evaluate the cold email below and respond exactly in the requested format.

### Cold Email
${email.trim()}

### Output Format
Provide the following sections in order. Each section should feel energetic but precise.

1. ## 🔥 The Roast
   - 3–5 bullet points calling out clichés, tonal misses, structure issues, and credibility gaps.
   - Be witty, but end each point with a concrete fix or lesson.

2. ## ✨ The Rewrite
   - Include a subject line and the full rewritten email.
   - Preserve the sender's intent while making it persuasive, specific, and human.
   - Keep it under 180 words and end with a single crisp CTA sentence.

3. ## 💡 Why It's Better
   - 3–5 bullet points referencing the exact improvements you made.
   - Tie each point to a named copywriting principle (clarity, personalization, social proof, urgency, CTA, etc.).

Finish with a short **Next Steps** line suggesting what the sender should practice next.`;

    logger.info({ promptLength: userPrompt.length, emailLength: email.length, maxOutputTokens: 32768 }, "Generating AI response");

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.8,
      maxOutputTokens: 32768, // Increased to 32k tokens to allow for more comprehensive responses (max limit: 65,536)
    });

    if (!text) {
      logger.error({ error: "No text generated" }, "Failed to generate response");
      return NextResponse.json(
        { error: "Failed to generate response" },
        { status: 500 }
      );
    }

    logger.info({ responseLength: text.length }, "AI response generated successfully");
    return NextResponse.json({ result: text });
  } catch (error) {
    logger.error({ err: error, errorMessage: error instanceof Error ? error.message : String(error) }, "Error processing request");

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
