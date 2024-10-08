/*
  Warnings:

  - You are about to drop the column `job` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `code` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(6)`.
  - A unique constraint covering the columns `[code]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `job`,
    ADD COLUMN `company` VARCHAR(255) NULL,
    MODIFY `code` VARCHAR(6) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_code_key` ON `User`(`code`);

-- CreateIndex
CREATE INDEX `User_code_idx` ON `User`(`code`);
