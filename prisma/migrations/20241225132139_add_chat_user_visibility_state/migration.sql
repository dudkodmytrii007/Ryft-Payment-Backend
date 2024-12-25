-- CreateTable
CREATE TABLE "ChatUserVisibilityState" (
    "chatUserId" TEXT NOT NULL,
    "state" BOOLEAN NOT NULL,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatUserVisibilityState_pkey" PRIMARY KEY ("chatUserId")
);

-- AddForeignKey
ALTER TABLE "ChatUserVisibilityState" ADD CONSTRAINT "ChatUserVisibilityState_chatUserId_fkey" FOREIGN KEY ("chatUserId") REFERENCES "ChatUser"("chatUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
