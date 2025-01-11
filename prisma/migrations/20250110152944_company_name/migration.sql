/*
  Warnings:

  - You are about to drop the column `label` on the `Company` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Company_label_key` ON `Company`;

-- AlterTable
ALTER TABLE `Company` DROP COLUMN `label`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Company_name_key` ON `Company`(`name`);
