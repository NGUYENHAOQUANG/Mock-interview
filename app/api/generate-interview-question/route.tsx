import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import axios from "axios";
import { aj } from "@/utils/arject";
import { currentUser } from "@clerk/nextjs/server";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_URL_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_URL_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});
export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const jobTitle = formData.get("jobTitle") as string;
    const jobDescription = formData.get("jobDescription") as string;
    const decision = await aj.protect(req, {
      userId: user?.primaryEmailAddress?.emailAddress ?? "",
      requested: 5,
    }); // Deduct 5 tokens from the bucket
    console.log("Arcjet decision", decision);

    //@ts-ignore
    if (decision?.reason?.remaining == 0) {
      return NextResponse.json({
        status: 429,
        result:
          "You have reached your limit for today. Please try again tomorrow.",
      });
    }

    if (file) {
      console.log("file", formData);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: `upload-${Date.now()}.pdf`,
        isPublished: true,
        useUniqueFileName: true,
      });

      const result = await axios.post(
        "http://localhost:5678/webhook-test/generate-interview-question",
        {
          resumeUrl: uploadResponse?.url,
        }
      );

      console.log(result.data.interview_questions);
      return NextResponse.json({
        questions: result.data?.interview_questions,
        resumeUrl: uploadResponse?.url,
        status: 200,
      });
    } else {
      const result = await axios.post(
        "http://localhost:5678/webhook-test/generate-interview-question",
        {
          resumeUrl: null,
          jobTitle: jobTitle,
          jobDescription: jobDescription,
        }
      );
      console.log(result.data);
      return NextResponse.json({
        questions: result.data?.interview_questions,
        resumeUrl: null,
      });
    }
  } catch (error: any) {
    console.log("upload error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
