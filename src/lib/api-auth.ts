import { NextResponse } from "next/server";

export function checkApiKey(request: Request) {
  const authHeader = request.headers.get("authorization");
  
  // Ex: "Bearer YOUR_API_KEY"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 });
  }

  const apiKey = authHeader.split(" ")[1];
  const validKey = process.env.AGENT_API_KEY || "AI_AGENT_KEY_12345"; // Default mock fallback for development

  if (apiKey !== validKey) {
    return NextResponse.json({ error: "Unauthorized: Invalid API Key" }, { status: 401 });
  }

  return null; // Null means passed
}
