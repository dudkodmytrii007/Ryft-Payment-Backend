/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - The required column `userId` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- CreateTable
CREATE TABLE "UserFriends" (
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,

    CONSTRAINT "UserFriends_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Chat" (
    "chatId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("chatId")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "chatMessageId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("chatMessageId")
);

-- CreateTable
CREATE TABLE "ChatUser" (
    "chatUserId" TEXT NOT NULL,
    "chatMessageId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isViewed" BOOLEAN NOT NULL,

    CONSTRAINT "ChatUser_pkey" PRIMARY KEY ("chatUserId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserFriends_userId_friendId_key" ON "UserFriends"("userId", "friendId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatUser_chatMessageId_key" ON "ChatUser"("chatMessageId");

-- AddForeignKey
ALTER TABLE "UserFriends" ADD CONSTRAINT "UserFriends_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFriends" ADD CONSTRAINT "UserFriends_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("chatId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_chatMessageId_fkey" FOREIGN KEY ("chatMessageId") REFERENCES "ChatMessage"("chatMessageId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("chatId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
