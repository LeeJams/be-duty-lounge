/*
  Warnings:

  - You are about to alter the column `code` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `code` VARCHAR(191) NOT NULL DEFAULT 'TEMP_CODE';
