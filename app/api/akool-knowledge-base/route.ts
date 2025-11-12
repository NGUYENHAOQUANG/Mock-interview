import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { question } = await req.json();
  const result = await axios.get(
    "https://openapi.akool.com/api/open/v4/knowledge/list",
    {
      headers: {
        Authorization: `Bearer ${process.env.AKOOL_API_TOKEN}`,
      },
    }
  );

  const isExist = result.data.data.find(
    (item: any) => item.name == "Interview Agent Prod"
  );

  if (!isExist) {
    const resp = await axios.post(
      "https://openapi.akool.com/api/open/v4/knowledge/create",
      {
        name: "Interview Agent Prod" + Date.now(),
        prologue: "",
        prompt: `Bạn là một người phỏng vấn thân thiện.
                  Hãy hỏi ứng viên từng câu hỏi một.
                  Đợi họ trả lời trước khi hỏi câu hỏi tiếp theo.
                  Hãy bắt đầu bằng: "Hãy giới thiệu về bạn."
                  Sau đó, hãy hỏi từng câu hỏi sau.
                  Hãy nói với giọng điệu chuyên nghiệp và khích lệ.
                  Các câu hỏi:
        ${question?.interviewQuestion.map((q: any) => q.question).join("\n")}
                  Sau khi người dùng trả lời, hãy hỏi câu hỏi tiếp theo trong danh sách.Không lặp lại các câu hỏi trước đó.`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AKOOL_API_TOKEN}`,
        },
      }
    );
    console.log(resp.data);
    return NextResponse.json(resp.data);
  }
  return NextResponse.json(result.data);
}
