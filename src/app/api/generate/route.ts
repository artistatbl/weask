import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { generateDocument } from "@/lib/documentGenerator";
import { prisma } from "@/lib/db";
import { createJob, updateJob } from "@/utils/types";

export async function POST(req: NextRequest) {
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

    const job = await createJob(type, url, dbUser.id);

    // Start the generation process in the background
    generateDocument(type, url, dbUser.id)
      .then(async (document) => {
        if ('error' in document) {
          await updateJob(job.id, 'failed', null, document.output);
        } else {
          await updateJob(job.id, 'completed', document);
        }
      })
      .catch(async (error) => {
        console.error("Document generation error:", error);
        await updateJob(job.id, 'failed', null, error.message);
      });

    // Immediately return the job ID
    return NextResponse.json({ jobId: job.id }, { status: 202 });

  } catch (error: unknown) {
    console.error("Unexpected error:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: "An unexpected error occurred.", details: errorMessage },
      { status: 500 }
    );
  }
}