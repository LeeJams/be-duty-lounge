-- CreateTable
CREATE TABLE `Report` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `postId` INTEGER NULL,
    `commentId` INTEGER NULL,
    `reason` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Report_userId_idx`(`userId`),
    INDEX `Report_postId_idx`(`postId`),
    INDEX `Report_commentId_idx`(`commentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
