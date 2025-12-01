import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google API key is not configured" },
        { status: 500 }
      );
    }

    const { email } = await request.json();

    if (!email || typeof email !== "string" || email.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide a cold email to roast" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert cold email critic with a sharp wit and no filter. Your job is to:

1. ROAST the cold email brutally - point out every weakness, cliché, and mistake with humor and sarcasm
2. REWRITE the email into a significantly improved version that would actually get responses
3. EXPLAIN why your version is better in clear, actionable terms

Be entertaining but educational. The goal is to help people write better cold emails through honest (and funny) feedback.`;

    const userPrompt = `Here's a cold email to roast and rewrite:

---
${email}
---

Please provide:
1. **🔥 THE ROAST**: A brutally honest, entertaining critique of this email. Point out what's wrong, what's cliché, what makes the reader want to hit delete. Be savage but constructive.

2. **✨ THE REWRITE**: An improved version of this email that would actually get responses. Keep the core intent but make it compelling.

3. **💡 WHY IT'S BETTER**: Explain the key changes you made and why they work. Be specific about what principles you applied.`;

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.8,
      maxOutputTokens: 2000,
    });

    if (!text) {
      return NextResponse.json(
        { error: "Failed to generate response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Error processing request:", error);

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
