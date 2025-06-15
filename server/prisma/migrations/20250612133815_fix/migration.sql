/*
  Warnings:

  - You are about to drop the `ProductSelectableOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SelectedCartItemOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SelectedOrderItemOption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductSelectableOption" DROP CONSTRAINT "ProductSelectableOption_productId_fkey";

-- DropForeignKey
ALTER TABLE "SelectedCartItemOption" DROP CONSTRAINT "SelectedCartItemOption_cartItemId_fkey";

-- DropForeignKey
ALTER TABLE "SelectedCartItemOption" DROP CONSTRAINT "SelectedCartItemOption_optionId_fkey";

-- DropForeignKey
ALTER TABLE "SelectedOrderItemOption" DROP CONSTRAINT "SelectedOrderItemOption_optionId_fkey";

-- DropForeignKey
ALTER TABLE "SelectedOrderItemOption" DROP CONSTRAINT "SelectedOrderItemOption_orderItemId_fkey";

-- DropTable
DROP TABLE "ProductSelectableOption";

-- DropTable
DROP TABLE "SelectedCartItemOption";

-- DropTable
DROP TABLE "SelectedOrderItemOption";
