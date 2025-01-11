/*
  Warnings:

  - You are about to alter the column `label` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - A unique constraint covering the columns `[label]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Company` MODIFY `label` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Company_label_key` ON `Company`(`label`);
