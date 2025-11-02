import { NextRequest } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const message = params.get("Body") || "Empty message";

  console.log("Incoming SMS:", message);

  try {
    // call your AgentKit workflow instead of just a model
    const result = await client.workflows.invoke(
      process.env.WORKFLOW_ID as string,
      {
        input: { input_as_text: message },
      }
    );

    const reply = result.output_text || "Bianca didn’t respond.";

    const twiml = `<Response><Message>${reply}</Message></Response>`;

    return new Response(twiml, {
      headers: { "Content-Type": "text/xml" },
      status: 200,
    });
  } catch (error) {
    console.error("Error invoking workflow:", error);
    const twiml = `<Response><Message>Bianca encountered an error: ${error}</Message></Response>`;
    return new Response(twiml, {
      headers: { "Content-Type": "text/xml" },
      status: 500,
    });
  }
}