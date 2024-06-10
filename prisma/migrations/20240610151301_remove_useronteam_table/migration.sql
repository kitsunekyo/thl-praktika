/*
  Warnings:

  - You are about to drop the `UserOnTeam` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "UserOnTeam";

-- CreateTable
CREATE TABLE "_members" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_members_AB_unique" ON "_members"("A", "B");

-- CreateIndex
CREATE INDEX "_members_B_index" ON "_members"("B");
