-- AlterTable
ALTER TABLE `User` MODIFY `job` VARCHAR(50) NULL,
    MODIFY `profileEmotion` VARCHAR(50) NOT NULL DEFAULT 'emoticon';
