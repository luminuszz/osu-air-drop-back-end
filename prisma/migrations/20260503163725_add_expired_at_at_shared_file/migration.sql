/*
  Warnings:

  - Added the required column `expiresAt` to the `SharedFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SharedFile" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;
