import axios from "axios";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const result = await axios.post(
    "http://localhost:5678/webhook/6168abf6-0da6-4842-b94a-c86c2e19051b",
    {
      messages: JSON.stringify(messages),
    }
  );
  console.log(result);
  return NextResponse.json(result.data?.message?.content);
}
