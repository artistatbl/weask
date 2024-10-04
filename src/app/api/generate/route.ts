import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { generateDocument } from "@/lib/documentGenerator";
import { prisma } from "@/lib/db";

export const POST = async (req: NextRequest) => {
  try {
    const user = await currentUser();
    if (!user) {
      console.error("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, url } = await req.json();

    if (!url) {
      console.error("URL is required but not provided");
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      console.error("User not found in database");
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    console.log('Generating document for URL:', url);

    const document = await generateDocument(type, url, user.id);
    if ('error' in document) {
      console.error("Error in document generation:", document.output);
      return NextResponse.json({ error: document.output }, { status: 400 });
    }
    console.log('Generated document:', document);
    return NextResponse.json({ document });

  } catch (error: Error | unknown) {
    console.error("Document generation error:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: "An unexpected error occurred.", details: errorMessage },
      { status: 500 }
    );
  }
};