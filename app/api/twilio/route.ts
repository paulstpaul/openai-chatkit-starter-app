/* eslint-disable */
// @ts-nocheck
import OpenAI from "openai";
import { NextRequest } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const message = params.get("Body") || "";

  console.log("Incoming SMS:", message);

  try {
    const result = await openai.responses.create({
      model: "gpt-4o-mini", // or "gpt-4o" if available
      input: [
        {
          role: "system",
          content:
            "You are Bianca, an executive AI assistant that drafts clear, professional messages and memos.",
        },
        { role: "user", content: message },
      ],
    });

    const reply = result.output_text || "Bianca didn’t respond.";

    return new Response(`<Response><Message>${reply}</Message></Response>`, {
      headers: { "Content-Type": "text/xml" },
      status: 200,
    });
  } catch (err) {
    console.error("Error generating response:", err);
    return new Response(
      `<Response><Message>Error: ${err}</Message></Response>`,
      {
        headers: { "Content-Type": "text/xml" },
        status: 500,
      }
    );
  }
}
