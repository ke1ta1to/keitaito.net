/*
  Warnings:

  - You are about to drop the column `content` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `dateText` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `activities` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('en_US', 'ja_JP');

-- AlterTable
ALTER TABLE "activities" DROP COLUMN "content",
DROP COLUMN "dateText",
DROP COLUMN "title";

-- CreateTable
CREATE TABLE "activity_translations" (
    "id" SERIAL NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "dateText" TEXT NOT NULL,
    "activityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_translations_activityId_idx" ON "activity_translations"("activityId");

-- CreateIndex
CREATE INDEX "activity_translations_locale_idx" ON "activity_translations"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "activity_translations_activityId_locale_key" ON "activity_translations"("activityId", "locale");

-- CreateIndex
CREATE INDEX "activities_userId_idx" ON "activities"("userId");

-- AddForeignKey
ALTER TABLE "activity_translations" ADD CONSTRAINT "activity_translations_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
