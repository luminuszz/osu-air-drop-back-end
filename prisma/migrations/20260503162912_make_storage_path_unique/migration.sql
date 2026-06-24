/*
  Warnings:

  - A unique constraint covering the columns `[storagePath]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_storagePath_key" ON "File"("storagePath");
