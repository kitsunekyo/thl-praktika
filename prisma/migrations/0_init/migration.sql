-- CreateTable
CREATE TABLE "Account" (
    "id" VARCHAR(191) NOT NULL,
    "userId" VARCHAR(191) NOT NULL,
    "type" VARCHAR(191) NOT NULL,
    "provider" VARCHAR(191) NOT NULL,
    "providerAccountId" VARCHAR(191) NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" VARCHAR(191),
    "scope" VARCHAR(191),
    "id_token" TEXT,
    "session_state" VARCHAR(191),

    CONSTRAINT "idx_81920_PRIMARY" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" VARCHAR(191) NOT NULL,
    "sessionToken" VARCHAR(191) NOT NULL,
    "userId" VARCHAR(191) NOT NULL,
    "expires" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "idx_81944_PRIMARY" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(191) NOT NULL,
    "name" VARCHAR(191),
    "email" VARCHAR(191) NOT NULL,
    "emailVerified" TIMESTAMPTZ(6),
    "image" VARCHAR(191),
    "role" VARCHAR(191) NOT NULL DEFAULT 'user',
    "password" VARCHAR(191),
    "address" VARCHAR(191),
    "city" VARCHAR(191),
    "zipCode" VARCHAR(191),
    "phone" VARCHAR(191),
    "lastLogin" TIMESTAMPTZ(6),
    "preferences" JSON,

    CONSTRAINT "idx_81961_PRIMARY" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" VARCHAR(191) NOT NULL,
    "token" VARCHAR(191) NOT NULL,
    "expires" TIMESTAMPTZ(6) NOT NULL
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" VARCHAR(191) NOT NULL,
    "email" VARCHAR(191) NOT NULL,
    "name" VARCHAR(191),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" VARCHAR(191) NOT NULL DEFAULT 'user',

    CONSTRAINT "idx_81925_PRIMARY" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Training" (
    "id" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start" TIMESTAMPTZ(6) NOT NULL,
    "end" TIMESTAMPTZ(6) NOT NULL,
    "description" TEXT,
    "maxInterns" INTEGER NOT NULL,
    "authorId" VARCHAR(191) NOT NULL,
    "address" VARCHAR(191),
    "city" VARCHAR(191),
    "zipCode" VARCHAR(191),

    CONSTRAINT "idx_81949_PRIMARY" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "id" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trainingId" VARCHAR(191) NOT NULL,
    "userId" VARCHAR(191) NOT NULL,

    CONSTRAINT "idx_81938_PRIMARY" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(191) NOT NULL,
    "secret" VARCHAR(191) NOT NULL,
    "expires" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "idx_81932_PRIMARY" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingRequest" (
    "id" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" VARCHAR(191) NOT NULL,
    "trainerId" VARCHAR(191) NOT NULL,
    "message" VARCHAR(191),

    CONSTRAINT "idx_81955_PRIMARY" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_81920_Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "idx_81920_Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "idx_81944_Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "idx_81944_Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "idx_81961_User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "idx_81967_VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "idx_81967_VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "idx_81949_Training_authorId_idx" ON "Training"("authorId");

-- CreateIndex
CREATE INDEX "idx_81938_Registration_trainingId_idx" ON "Registration"("trainingId");

-- CreateIndex
CREATE INDEX "idx_81938_Registration_userId_idx" ON "Registration"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "idx_81938_Registration_trainingId_userId_key" ON "Registration"("trainingId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "idx_81932_PasswordResetToken_secret_key" ON "PasswordResetToken"("secret");

-- CreateIndex
CREATE UNIQUE INDEX "idx_81932_PasswordResetToken_secret_email_key" ON "PasswordResetToken"("secret", "email");

-- CreateIndex
CREATE INDEX "idx_81955_TrainingRequest_trainerId_idx" ON "TrainingRequest"("trainerId");

-- CreateIndex
CREATE INDEX "idx_81955_TrainingRequest_userId_idx" ON "TrainingRequest"("userId");

