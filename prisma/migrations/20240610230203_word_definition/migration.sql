/*
  Warnings:

  - Added the required column `definition` to the `Word` table without a default value. This is not possible if the table is not empty.
  - Added the required column `word` to the `Word` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "definition" TEXT NOT NULL,
ADD COLUMN     "word" TEXT NOT NULL;
