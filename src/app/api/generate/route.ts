import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { generateDocument } from "@/lib/documentGenerator";

export const POST = async (req: NextRequest) => {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, content } = await req.json();

    const document = await generateDocument(type, content);
    return NextResponse.json({ document });

  } catch (error: any) {
    console.error("Document generation error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred.", details: error.message },
      { status: 500 }
    );
  }
};