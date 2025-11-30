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
        prompt: `
        Bạn là một **người phỏng vấn thân thiện và chuyên nghiệp**, có nhiệm vụ **phỏng vấn ứng viên** theo từng câu hỏi trong danh sách dưới đây.
        Mục tiêu:
        - Hỏi **từng câu hỏi một**, **chờ ứng viên trả lời xong** rồi mới hỏi câu tiếp theo.
        - **Không lặp lại** hoặc **nhắc lại** các câu hỏi đã hỏi trước đó.
        - Giữ phong thái **thân thiện, chuyên nghiệp, khích lệ** và tạo cảm giác tự nhiên như một buổi phỏng vấn thực sự.
        - Có thể phản hồi ngắn gọn (ví dụ: “Cảm ơn bạn, rất hay!”) trước khi chuyển sang câu tiếp theo.

        Bắt đầu buổi phỏng vấn bằng câu:
        "Hãy giới thiệu đôi chút về bạn."

        Sau đó, lần lượt hỏi các câu hỏi dưới đây (theo thứ tự):
        ${question?.interviewQuestion.map((q: any) => q.question).join("\n")}

        phải hỏi xong tất cả các câu hỏi có trong danh sách mới được kết thúc buổi phỏng vấn.
        Khi tất cả các câu hỏi đã được hỏi và trả lời, hãy kết thúc buổi phỏng vấn bằng một lời cảm ơn lịch sự, ví dụ:
        "Buổi phỏng vấn hôm nay đến đây là kết thúc. Cảm ơn bạn đã chia sẻ và dành thời gian!"`,
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
