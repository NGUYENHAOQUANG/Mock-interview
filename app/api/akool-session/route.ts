import axios from "axios";
import next from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { avatar_id, knowledge_id } = await req.json();
  const result = await axios.post(
    "https://openapi.akool.com/api/open/v4/LiveAvatar/session/create",
    {
      avatar_id,
      knowledge_id,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.AKOOL_API_TOKEN}`,
      },
    }
  );
  return NextResponse.json(result.data);
}
