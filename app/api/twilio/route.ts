import OpenAI from "openai";
import { NextRequest } from "next/server";

// Extend the OpenAI client type to include workflows without using 'any'
interface OpenAIWithWorkflows extends OpenAI {
  workflows: {
    invoke: (
      id: string,
      args: { input: { input_as_text: string } }
    ) => Promise<{ output_text?: string }>;
  };
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) as OpenAIWithWorkflows;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const message = params.get("Body") || "";

  console.log("Incoming SMS:", message);

  try {
    const result = await openai.workflows.invoke(process.env.WORKFLOW_ID!, {
      input: { input_as_text: message },
    });

    const reply = result.output_text || "Bianca didn’t respond.";

    return new Response(`<Response><Message>${reply}</Message></Response>`, {
      headers: { "Content-Type": "text/xml" },
      status: 200,
    });
  } catch (err) {
    console.error("Error invoking workflow:", err);
    return new Response(
      `<Response><Message>Error: ${err}</Message></Response>`,
      {
        headers: { "Content-Type": "text/xml" },
        status: 500,
      }
    );
  }
}