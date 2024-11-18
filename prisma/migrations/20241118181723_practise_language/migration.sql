/*
  Warnings:

  - Added the required column `languageId` to the `Practise` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Practise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Practise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Practise_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Practise" ("createdAt", "id", "name", "userId") SELECT "createdAt", "id", "name", "userId" FROM "Practise";
DROP TABLE "Practise";
ALTER TABLE "new_Practise" RENAME TO "Practise";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
