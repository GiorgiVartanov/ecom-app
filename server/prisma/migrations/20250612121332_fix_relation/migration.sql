/*
  Warnings:

  - You are about to drop the column `optionId` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the column `endsAt` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `startsAt` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Tag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_optionId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_productId_fkey";

-- DropIndex
DROP INDEX "ProductImage_optionId_idx";

-- DropIndex
DROP INDEX "Tag_key_value_idx";

-- DropIndex
DROP INDEX "Tag_productId_idx";

-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "optionId";

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "endsAt",
DROP COLUMN "startsAt";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "productId";

-- CreateTable
CREATE TABLE "_ProductToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProductToTag_B_index" ON "_ProductToTag"("B");

-- AddForeignKey
ALTER TABLE "_ProductToTag" ADD CONSTRAINT "_ProductToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToTag" ADD CONSTRAINT "_ProductToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
