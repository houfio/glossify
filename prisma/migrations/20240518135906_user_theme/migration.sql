-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('AUTOMATIC', 'LIGHT', 'DARK');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "theme" "Theme" NOT NULL DEFAULT 'AUTOMATIC';
