/*
  Warnings:

  - You are about to drop the column `key` on the `Tag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[keyId,value]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `keyId` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "key",
ADD COLUMN     "keyId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TagKey" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isSearchable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TagKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TagKey_name_key" ON "TagKey"("name");

-- CreateIndex
CREATE INDEX "Tag_keyId_idx" ON "Tag"("keyId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_keyId_value_key" ON "Tag"("keyId", "value");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_keyId_fkey" FOREIGN KEY ("keyId") REFERENCES "TagKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
