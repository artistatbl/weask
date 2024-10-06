import { prisma } from "@/lib/db";
import { Prisma } from '@prisma/client';

export interface Message {
  id: string | number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: Date;
}

export interface Links {
  label: string;
  href: string;
  icon: React.ReactNode;
  textColor?: string;
}

export interface GeneratedContent {
  title?: string;
  introduction?: string;
  mainContent?: { heading: string; paragraphs: string[] }[];
  conclusion?: string;
  references?: string[];
}

export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface Job {
  id: string;
  status: JobStatus;
  type: string;
  url: string;
  userId: string;
  result?: GeneratedContent;
  error?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Type guard to check if a status is a valid JobStatus
function isValidJobStatus(status: string): status is JobStatus {
  return ['pending', 'in_progress', 'completed', 'failed'].includes(status);
}

export async function createJob(type: string, url: string, userId: string): Promise<Job> {
  const job = await prisma.job.create({
    data: { 
      status: 'pending',
      type,
      url,
      userId,
    }
  });
  return {
    ...job,
    status: job.status as JobStatus,
    result: job.result as GeneratedContent | undefined
  };
}
export async function updateJob(
  id: string, 
  status: JobStatus, 
  result?: GeneratedContent, 
  error?: string | null
): Promise<void> {
  await prisma.job.update({
    where: { id },
    data: { 
      status, 
      result: result ? (JSON.parse(JSON.stringify(result)) as Prisma.JsonValue) : undefined,
      error,
      updatedAt: new Date()
    }
  });
}

export async function getJob(id: string): Promise<Job | null> {
  const job = await prisma.job.findUnique({ where: { id } });

  if (!job) return null;

  return {
    ...job,
    status: isValidJobStatus(job.status) ? job.status : 'pending',
    result: job.result as GeneratedContent | undefined
  };
}

export async function getJobsForUser(userId: string): Promise<Job[]> {
  const jobs = await prisma.job.findMany({ 
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  return jobs.map(job => ({
    ...job,
    status: isValidJobStatus(job.status) ? job.status : 'pending',
    result: job.result as GeneratedContent | undefined
  }));
}