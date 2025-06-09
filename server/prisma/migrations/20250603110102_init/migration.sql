/*
  Warnings:

  - You are about to alter the column `total` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to drop the column `priceAtPurchase` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to drop the `Attribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductAttribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SelectedCartItemAttribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SelectedOrderItemAttribute` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `price` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('en', 'ka');

-- CreateEnum
CREATE TYPE "ColorTheme" AS ENUM ('AUTO', 'LIGHT', 'DARK');

-- DropForeignKey
ALTER TABLE "ProductAttribute" DROP CONSTRAINT "ProductAttribute_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "ProductAttribute" DROP CONSTRAINT "ProductAttribute_productId_fkey";

-- DropForeignKey
ALTER TABLE "SelectedCartItemAttribute" DROP CONSTRAINT "SelectedCartItemAttribute_cartItemId_fkey";

-- DropForeignKey
ALTER TABLE "SelectedOrderItemAttribute" DROP CONSTRAINT "SelectedOrderItemAttribute_orderItemId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "total" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "priceAtPurchase",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "optionId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "colorTheme" "ColorTheme" NOT NULL DEFAULT 'AUTO',
ADD COLUMN     "isSuspended" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "preferredLanguage" "Language" NOT NULL DEFAULT 'en',
ADD COLUMN     "shippingAddress" TEXT;

-- DropTable
DROP TABLE "Attribute";

-- DropTable
DROP TABLE "ProductAttribute";

-- DropTable
DROP TABLE "SelectedCartItemAttribute";

-- DropTable
DROP TABLE "SelectedOrderItemAttribute";

-- CreateTable
CREATE TABLE "SearchHistoryItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchHistoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTag" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "ProductTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSelectableOption" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "ProductSelectableOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelectedCartItemOption" (
    "id" TEXT NOT NULL,
    "cartItemId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,

    CONSTRAINT "SelectedCartItemOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelectedOrderItemOption" (
    "id" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,

    CONSTRAINT "SelectedOrderItemOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserWishlist" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserWishlist_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "SearchHistoryItem_userId_idx" ON "SearchHistoryItem"("userId");

-- CreateIndex
CREATE INDEX "ProductTag_productId_idx" ON "ProductTag"("productId");

-- CreateIndex
CREATE INDEX "ProductSelectableOption_productId_idx" ON "ProductSelectableOption"("productId");

-- CreateIndex
CREATE INDEX "SelectedCartItemOption_cartItemId_idx" ON "SelectedCartItemOption"("cartItemId");

-- CreateIndex
CREATE INDEX "SelectedCartItemOption_optionId_idx" ON "SelectedCartItemOption"("optionId");

-- CreateIndex
CREATE INDEX "SelectedOrderItemOption_orderItemId_idx" ON "SelectedOrderItemOption"("orderItemId");

-- CreateIndex
CREATE INDEX "SelectedOrderItemOption_optionId_idx" ON "SelectedOrderItemOption"("optionId");

-- CreateIndex
CREATE INDEX "_UserWishlist_B_index" ON "_UserWishlist"("B");

-- CreateIndex
CREATE INDEX "ProductImage_optionId_idx" ON "ProductImage"("optionId");

-- AddForeignKey
ALTER TABLE "SearchHistoryItem" ADD CONSTRAINT "SearchHistoryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTag" ADD CONSTRAINT "ProductTag_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSelectableOption" ADD CONSTRAINT "ProductSelectableOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "ProductSelectableOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedCartItemOption" ADD CONSTRAINT "SelectedCartItemOption_cartItemId_fkey" FOREIGN KEY ("cartItemId") REFERENCES "CartItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedCartItemOption" ADD CONSTRAINT "SelectedCartItemOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "ProductSelectableOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedOrderItemOption" ADD CONSTRAINT "SelectedOrderItemOption_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedOrderItemOption" ADD CONSTRAINT "SelectedOrderItemOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "ProductSelectableOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserWishlist" ADD CONSTRAINT "_UserWishlist_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserWishlist" ADD CONSTRAINT "_UserWishlist_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
