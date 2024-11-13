/*
  Warnings:

  - You are about to drop the column `chatMessageId` on the `ChatUser` table. All the data in the column will be lost.
  - Added the required column `chatUserId` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChatUser" DROP CONSTRAINT "ChatUser_chatMessageId_fkey";

-- DropIndex
DROP INDEX "ChatUser_chatMessageId_key";

-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "chatUserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ChatUser" DROP COLUMN "chatMessageId";

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_chatUserId_fkey" FOREIGN KEY ("chatUserId") REFERENCES "ChatUser"("chatUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
