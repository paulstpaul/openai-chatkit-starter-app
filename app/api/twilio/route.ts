import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  const message = params.get("Body") || "";
  
  console.log("Incoming SMS:", message);

  const twiml = `<Response><Message>Received: ${message}</Message></Response>`;
  
  return new Response(twiml, {
    headers: { "Content-Type": "text/xml" },
    status: 200,
  });
}