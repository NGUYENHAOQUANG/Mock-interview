import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import axios from "axios";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_URL_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_URL_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File not found" });
    }
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

    console.log(result.data);
    return NextResponse.json(result.data, { status: 200 });
  } catch (error: any) {
    console.log("upload error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
