/*
  Warnings:

  - A unique constraint covering the columns `[userId,parentId,name]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,tag]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[folderId,left]` on the table `Word` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Folder_userId_parentId_name_key" ON "Folder"("userId", "parentId", "name") NULLS NOT DISTINCT;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_userId_tag_key" ON "Tag"("userId", "tag");

-- CreateIndex
CREATE UNIQUE INDEX "Word_folderId_left_key" ON "Word"("folderId", "left");
