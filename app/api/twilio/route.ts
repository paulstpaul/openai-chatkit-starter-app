import { NextRequest } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const message = params.get("Body") || "Empty message";

  console.log("Incoming SMS:", message);

  // Call Bianca's ChatKit or OpenAI model
  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: [{ role: "user", content: message }],
  });

  const reply = response.output_text || "Bianca didn’t respond.";

  const twiml = `<Response><Message>${reply}</Message></Response>`;

  return new Response(twiml, {
    headers: { "Content-Type": "text/xml" },
    status: 200,
  });
}