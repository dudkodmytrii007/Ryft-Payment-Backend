-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_chatId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_chatUserId_fkey";

-- AlterTable
ALTER TABLE "ChatMessage" ALTER COLUMN "chatId" DROP NOT NULL,
ALTER COLUMN "chatUserId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_chatUserId_fkey" FOREIGN KEY ("chatUserId") REFERENCES "ChatUser"("chatUserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("chatId") ON DELETE SET NULL ON UPDATE CASCADE;
