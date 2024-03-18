/*
  Warnings:

  - A unique constraint covering the columns `[endpoint]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subscription_endpoint_key" ON "Subscription"("endpoint");
