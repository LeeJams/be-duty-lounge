-- AlterTable
ALTER TABLE `User` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `Shift` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `color` VARCHAR(50) NOT NULL,

    INDEX `Shift_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `day1` INTEGER NULL,
    `day2` INTEGER NULL,
    `day3` INTEGER NULL,
    `day4` INTEGER NULL,
    `day5` INTEGER NULL,
    `day6` INTEGER NULL,
    `day7` INTEGER NULL,
    `day8` INTEGER NULL,
    `day9` INTEGER NULL,
    `day10` INTEGER NULL,
    `day11` INTEGER NULL,
    `day12` INTEGER NULL,
    `day13` INTEGER NULL,
    `day14` INTEGER NULL,
    `day15` INTEGER NULL,
    `day16` INTEGER NULL,
    `day17` INTEGER NULL,
    `day18` INTEGER NULL,
    `day19` INTEGER NULL,
    `day20` INTEGER NULL,
    `day21` INTEGER NULL,
    `day22` INTEGER NULL,
    `day23` INTEGER NULL,
    `day24` INTEGER NULL,
    `day25` INTEGER NULL,
    `day26` INTEGER NULL,
    `day27` INTEGER NULL,
    `day28` INTEGER NULL,
    `day29` INTEGER NULL,
    `day30` INTEGER NULL,
    `day31` INTEGER NULL,

    UNIQUE INDEX `Schedule_userId_month_year_key`(`userId`, `month`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Shift` ADD CONSTRAINT `Shift_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
