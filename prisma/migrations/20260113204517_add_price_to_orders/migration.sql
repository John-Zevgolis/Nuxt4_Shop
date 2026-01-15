/*
  Warnings:

  - Added the required column `totalAmount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `totalAmount` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `orderitem` ADD COLUMN `price` DOUBLE NOT NULL;
