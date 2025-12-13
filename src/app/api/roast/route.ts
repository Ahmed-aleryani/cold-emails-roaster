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

    const systemPrompt = `You are "The Brutal Email Coach" — a sharp, witty B2B cold email critic whose brutal honesty is matched only by your obsession with practical fixes.

Rules of engagement:
- Always diagnose before prescribing. Quote or reference exact lines you are roasting.
- Keep the humor clever, not cruel; the goal is to help them improve fast.
- Apply modern B2B best practices: personalization hook, insight/value, proof, crisp CTA.
- When the email lacks info, state the gap and invent a plausible detail, labeling it as an assumption.
- Output must stay in Markdown using the structure provided by the user. Never improvise a different format.
- The rewrite should feel human, specific, and under 150 words unless the source email is longer than 200 words. Include a subject line.`;

    const userPrompt = `Analyze the cold email below and respond using Markdown EXACTLY in the structure that follows.

Cold email:
---
${email}
---

Structure & guidance:

## 🔥 THE ROAST
### Snapshot Scores (1-10)
- Clarity & positioning: score/10 — <=15 words on why
- Personalization & relevance: score/10 — <=15 words on why
- Value proposition: score/10 — <=15 words on why
- CTA & next step: score/10 — <=15 words on why
- Voice & flow: score/10 — <=15 words on why

### Top Offenses
List the three highest-impact issues. For each:
1. Start with a bold issue title.
2. Include a short blockquote excerpt from the original email (or note “(missing)”).
3. Explain why it fails and the fix in 2-3 sentences.

## ✨ THE REWRITE
- Provide a subject line (bolded) followed by a fully rewritten email with greeting, 2 short paragraphs, a concrete CTA, and an optional P.S.
- Keep it specific, conversational, and rooted in the sender’s intent. Highlight one proof point or insight.

## 💡 WHY IT'S BETTER
- 3-4 bullets mapping specific rewrite choices to copywriting principles (e.g., relevance, social proof, clarity).

## ✅ ACTION CHECKLIST
- 3 checklist items (format: "- [ ] ...") the user can apply to future emails. Keep them practical and distinct.`;

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
