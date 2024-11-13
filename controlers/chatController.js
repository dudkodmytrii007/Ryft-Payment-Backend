const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const findUserChat = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all ChatUser instances where the userId is assigned
    const foundChatUserInstances = await prisma.chatUser.findMany({
      where: { userId }
    });

    if (foundChatUserInstances && foundChatUserInstances.length > 0) {
      // Use Promise.all to wait for all the asynchronous calls to complete
      const chatsPromises = foundChatUserInstances.map(async (foundChatUserInstance) => {
        const chatId = foundChatUserInstance.chatId;

        // Fetch chat details for each chatId
        const foundChatInstance = await prisma.chat.findFirst({
          where: { chatId }
        });

        return foundChatInstance;
      });

      // Wait for all the promises to resolve
      const chats = await Promise.all(chatsPromises);

      res.status(200).json(foundChatUserInstances); // Send response once all chats are fetched
    } else {
      res.status(200).json([]); // Return an empty array if no chats are found
    }
  } catch (error) {
    console.error("Error fetching user chats:", error);
    res.status(500).json({ error: 'Error retrieving user chats' });
  }
};

module.exports = { findUserChat };
