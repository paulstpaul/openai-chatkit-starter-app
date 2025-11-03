import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const message = params.get("Body") || "";

  console.log("Incoming SMS:", message);

  try {
    const response = await fetch(
      `https://api.openai.com/v1/workflows/${process.env.WORKFLOW_ID}/invoke`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: { input_as_text: message },
        }),
      }
    );

    const data = await response.json();
    const reply =
      data.output_text ||
      data.output?.output_text ||
      "Bianca didn’t respond.";

    return new Response(
      `<Response><Message>${reply}</Message></Response>`,
      {
        headers: { "Content-Type": "text/xml" },
        status: 200,
      }
    );
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