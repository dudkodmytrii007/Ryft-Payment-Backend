-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'group';

-- AlterTable
ALTER TABLE "ChatUser" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';
