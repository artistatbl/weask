/*
  Warnings:

  - A unique constraint covering the columns `[userId,sessionId,domain]` on the table `SearchHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SearchHistory_userId_sessionId_domain_key" ON "SearchHistory"("userId", "sessionId", "domain");
