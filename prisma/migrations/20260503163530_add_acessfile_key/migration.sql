/*
  Warnings:

  - A unique constraint covering the columns `[accessKey]` on the table `SharedFile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accessKey` to the `SharedFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SharedFile" ADD COLUMN     "accessKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SharedFile_accessKey_key" ON "SharedFile"("accessKey");
