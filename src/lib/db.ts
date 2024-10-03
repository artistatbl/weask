import { PrismaClient } from '@prisma/client'

declare global {
  // Use var to avoid issues with Vercel and ensure type safety
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma