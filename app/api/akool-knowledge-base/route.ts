import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  // const result = await axios.get(
  //   "https://openapi.akool.com/api/open/v4/knowledge/list",
  //   {
  //     headers: {
  //       Authorization: `Bearer ${process.env.AKOOL_API_TOKEN}`,
  //     },
  //   }
  // );

  // const isExist = result.data.data.find(
  //   (item: any) => item.name == "Interview Agent Prod"
  // );

  // if (!isExist) {
  const resp = await axios.post(
    "https://openapi.akool.com/api/open/v4/knowledge/create",
    {
      name: "Interview Agent Prod",
      prologue: "tell me about yourself",
      prompt: `You are a friendly job interviewer.
        Ask the user one interview question at a time.
        Wait for their spoken response before asking the next question.
        Start with: "Tell me about yourself."
        Then ask following questions one by one.
        Speak in a professional and encouraging tone.
        questions:
        ${JSON.stringify(question)}`,
      headers: {
        Authorization: `Bearer ${process.env.AKOOL_API_TOKEN}`,
      },
    }
  );
  console.log(resp.data);
  return NextResponse.json(resp.data);
  // }
  // return NextResponse.json(result.data);
}
