import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
  }

  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: job.status,
      result: job.status === 'completed' ? JSON.parse(job.result as string) : null,
      error: job.error,
    });
  } catch (error) {
    console.error("Error fetching job status:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching job status" },
      { status: 500 }
    );
  }
}