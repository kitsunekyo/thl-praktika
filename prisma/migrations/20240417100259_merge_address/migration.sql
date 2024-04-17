/*
  Warnings:

  - You are about to drop the column `city` on the `Training` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `Training` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Training" DROP COLUMN "city",
DROP COLUMN "zipCode";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "city",
DROP COLUMN "zipCode";
