-- AlterTable
ALTER TABLE "Account" RENAME CONSTRAINT "idx_84075_PRIMARY" TO "Account_pkey";

-- AlterTable
ALTER TABLE "Invitation" RENAME CONSTRAINT "idx_84080_PRIMARY" TO "Invitation_pkey";

-- AlterTable
ALTER TABLE "PasswordResetToken" RENAME CONSTRAINT "idx_84087_PRIMARY" TO "PasswordResetToken_pkey";

-- AlterTable
ALTER TABLE "Registration" RENAME CONSTRAINT "idx_84093_PRIMARY" TO "Registration_pkey";

-- AlterTable
ALTER TABLE "Session" RENAME CONSTRAINT "idx_84099_PRIMARY" TO "Session_pkey";

-- AlterTable
ALTER TABLE "Training" RENAME CONSTRAINT "idx_84104_PRIMARY" TO "Training_pkey";

-- AlterTable
ALTER TABLE "TrainingRequest" RENAME CONSTRAINT "idx_84110_PRIMARY" TO "TrainingRequest_pkey";

-- AlterTable
ALTER TABLE "User" RENAME CONSTRAINT "idx_84116_PRIMARY" TO "User_pkey";

-- RenameIndex
ALTER INDEX "idx_84075_Account_provider_providerAccountId_key" RENAME TO "Account_provider_providerAccountId_key";

-- RenameIndex
ALTER INDEX "idx_84075_Account_userId_idx" RENAME TO "Account_userId_idx";

-- RenameIndex
ALTER INDEX "idx_84087_PasswordResetToken_secret_email_key" RENAME TO "PasswordResetToken_secret_email_key";

-- RenameIndex
ALTER INDEX "idx_84087_PasswordResetToken_secret_key" RENAME TO "PasswordResetToken_secret_key";

-- RenameIndex
ALTER INDEX "idx_84093_Registration_trainingId_idx" RENAME TO "Registration_trainingId_idx";

-- RenameIndex
ALTER INDEX "idx_84093_Registration_trainingId_userId_key" RENAME TO "Registration_trainingId_userId_key";

-- RenameIndex
ALTER INDEX "idx_84093_Registration_userId_idx" RENAME TO "Registration_userId_idx";

-- RenameIndex
ALTER INDEX "idx_84099_Session_sessionToken_key" RENAME TO "Session_sessionToken_key";

-- RenameIndex
ALTER INDEX "idx_84099_Session_userId_idx" RENAME TO "Session_userId_idx";

-- RenameIndex
ALTER INDEX "idx_84104_Training_authorId_idx" RENAME TO "Training_authorId_idx";

-- RenameIndex
ALTER INDEX "idx_84110_TrainingRequest_trainerId_idx" RENAME TO "TrainingRequest_trainerId_idx";

-- RenameIndex
ALTER INDEX "idx_84110_TrainingRequest_userId_idx" RENAME TO "TrainingRequest_userId_idx";

-- RenameIndex
ALTER INDEX "idx_84116_User_email_key" RENAME TO "User_email_key";

-- RenameIndex
ALTER INDEX "idx_84122_VerificationToken_identifier_token_key" RENAME TO "VerificationToken_identifier_token_key";

-- RenameIndex
ALTER INDEX "idx_84122_VerificationToken_token_key" RENAME TO "VerificationToken_token_key";
