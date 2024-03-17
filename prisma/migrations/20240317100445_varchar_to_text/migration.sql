/*
  Warnings:

  - The primary key for the `Account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Invitation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PasswordResetToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Registration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Training` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TrainingRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Account" DROP CONSTRAINT "idx_81920_PRIMARY",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "type" SET DATA TYPE TEXT,
ALTER COLUMN "provider" SET DATA TYPE TEXT,
ALTER COLUMN "providerAccountId" SET DATA TYPE TEXT,
ALTER COLUMN "token_type" SET DATA TYPE TEXT,
ALTER COLUMN "scope" SET DATA TYPE TEXT,
ALTER COLUMN "session_state" SET DATA TYPE TEXT,
ADD CONSTRAINT "idx_81920_PRIMARY" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Invitation" DROP CONSTRAINT "idx_81925_PRIMARY",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "role" SET DATA TYPE TEXT,
ADD CONSTRAINT "idx_81925_PRIMARY" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PasswordResetToken" DROP CONSTRAINT "idx_81932_PRIMARY",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "secret" SET DATA TYPE TEXT,
ADD CONSTRAINT "idx_81932_PRIMARY" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Registration" DROP CONSTRAINT "idx_81938_PRIMARY",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "trainingId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "idx_81938_PRIMARY" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Session" DROP CONSTRAINT "idx_81944_PRIMARY",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "sessionToken" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "idx_81944_PRIMARY" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Training" DROP CONSTRAINT "idx_81949_PRIMARY",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "authorId" SET DATA TYPE TEXT,
ALTER COLUMN "address" SET DATA TYPE TEXT,
ALTER COLUMN "city" SET DATA TYPE TEXT,
ALTER COLUMN "zipCode" SET DATA TYPE TEXT,
ADD CONSTRAINT "idx_81949_PRIMARY" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TrainingRequest" DROP CONSTRAINT "idx_81955_PRIMARY",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "trainerId" SET DATA TYPE TEXT,
ALTER COLUMN "message" SET DATA TYPE TEXT,
ADD CONSTRAINT "idx_81955_PRIMARY" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "idx_81961_PRIMARY",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "image" SET DATA TYPE TEXT,
ALTER COLUMN "role" SET DATA TYPE TEXT,
ALTER COLUMN "password" SET DATA TYPE TEXT,
ALTER COLUMN "address" SET DATA TYPE TEXT,
ALTER COLUMN "city" SET DATA TYPE TEXT,
ALTER COLUMN "zipCode" SET DATA TYPE TEXT,
ALTER COLUMN "phone" SET DATA TYPE TEXT,
ADD CONSTRAINT "idx_81961_PRIMARY" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "VerificationToken" ALTER COLUMN "identifier" SET DATA TYPE TEXT,
ALTER COLUMN "token" SET DATA TYPE TEXT;
