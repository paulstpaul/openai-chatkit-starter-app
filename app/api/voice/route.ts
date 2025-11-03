/* eslint-disable */
// @ts-nocheck
import OpenAI from "openai";
import { NextRequest } from "next/server";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const transcript = params.get("SpeechResult") || "";
  const digits = params.get("Digits") || "";
  const userInput = transcript || digits || "";

  console.log("Incoming voice input:", userInput);

  try {
    // Generate Bianca's spoken reply using OpenAI
    const result = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "You are Bianca, a helpful executive assistant. Speak naturally, warmly, and professionally in short sentences appropriate for spoken voice.",
        },
        { role: "user", content: userInput || "Say hello to the caller." },
      ],
    });

    const reply = result.output_text || "I'm here, how can I assist you today?";
    console.log("Bianca (voice) reply:", reply);

    // TwiML with <Gather> to allow continued conversation
    const twiml = `
      <Response>
        <Gather input="speech" action="/api/voice" method="POST" timeout="5">
          <Say voice="Polly.Joanna">${reply}</Say>
        </Gather>
        <Say voice="Polly.Joanna">Goodbye.</Say>
      </Response>
    `;

    return new Response(twiml.trim(), {
      headers: { "Content-Type": "text/xml" },
      status: 200,
    });
  } catch (err) {
    console.error("Error in voice conversation:", err);
    return new Response(
      `<Response><Say>Sorry, I encountered an error processing your request.</Say></Response>`,
      {
        headers: { "Content-Type": "text/xml" },
        status: 500,
      }
    );
  }
}