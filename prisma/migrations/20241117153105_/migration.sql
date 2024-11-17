/*
  Warnings:

  - You are about to drop the `UserFriends` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserFriends" DROP CONSTRAINT "UserFriends_friendId_fkey";

-- DropForeignKey
ALTER TABLE "UserFriends" DROP CONSTRAINT "UserFriends_userId_fkey";

-- DropTable
DROP TABLE "UserFriends";

-- CreateTable
CREATE TABLE "Friendships" (
    "friendshipId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friendships_pkey" PRIMARY KEY ("friendshipId")
);
