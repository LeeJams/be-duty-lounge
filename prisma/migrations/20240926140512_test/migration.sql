/*
  Warnings:

  - You are about to drop the column `profileImageUrl` on the `User` table. All the data in the column will be lost.
  - Added the required column `job` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileEmotion` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `profileImageUrl`,
    ADD COLUMN `job` VARCHAR(50) NOT NULL,
    ADD COLUMN `profileEmotion` VARCHAR(50) NOT NULL;
