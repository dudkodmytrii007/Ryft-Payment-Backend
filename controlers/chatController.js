const { PrismaClient } = require('@prisma/client');
const { findUserById } = require('../models/userModel');
const prisma = new PrismaClient();

const findUserChat = async (req, res) => {
  const { userId } = req.body;

  try {
    const foundChatUserInstances = await prisma.chatUser.findMany({
      where: { userId },
    });

    if (foundChatUserInstances && foundChatUserInstances.length > 0) {
      const chatResults = await Promise.all(
        foundChatUserInstances.map(async (foundChatUserInstance) => {
          const chat = await prisma.chat.findUnique({
            where: {
              chatId: foundChatUserInstance.chatId,
            },
          });
          return chat;
        })
      );

      const resultObjects = [];

      for (const chatResult of chatResults) {
        let chatName = '';
        let isAnyUserOnline = false;
        let lastUsersActivityDatesArray = '';
        let chatMessages = [];

        if (chatResult.name === '') {
          let isAnyUserOnline = false;
          const usersLastActivityDate = [];
          const chatUsers = await prisma.chatUser.findMany({
            where: {
              chatId: chatResult.chatId,
            },
          });

          const chatUsersNames = await Promise.all(
            chatUsers
            .filter((user) => user.userId != userId)
            .map(async (chatUser) => {
              const foundChatUser = await findUserById(chatUser.userId);

              if (foundChatUser.isOnline) {
                isAnyUserOnline = true;
              }

              usersLastActivityDate.push(chatUser.lastViewedDate);

              return foundChatUser.name;
            })
          );

          chatName = chatUsersNames.join(', ');
          isAnyUserOnline = this.isAnyUserOnline;
          usersLastActivityDate.sort((a, b) => new Date(b) - new Date(a));
          lastUsersActivityDatesArray = usersLastActivityDate.slice(0, 1)[0];
        } else {
          chatName = chatResult.name;
        }

        const currentChatUser = await prisma.chatUser.findMany({
          where: {
              userId: userId,
              chatId: chatResult.chatId
            }
        });

        chatMessages = await prisma.chatMessage.findMany({
          where: {
            chatId: chatResult.chatId,
            createdAt: {
              gt: currentChatUser[0].lastViewedDate,
            },
            chatUserId: {
              not: currentChatUser[0].chatUserId,
            },
          },
          orderBy: {
            createdAt: 'asc'
          },
          include: {
            chatUser: true,
          },
        });

        if (
          chatMessages.length > 0 &&
          chatMessages[chatMessages.length - 1].chatUserId === currentChatUser[0].chatUserId
        ) {
          chatMessages = [];
        }

        const lastUnreadMessage = (chatMessages.length > 0) ? chatMessages[chatMessages.length - 1].message : '';
        const lastUnreadMessageAuthor = (chatMessages.length > 0) ? (await findUserById(chatMessages[chatMessages.length - 1].chatUser.userId)).name : '';
        const lastUnreadMessageAuthorId = (chatMessages.length > 0) ? (await findUserById(chatMessages[chatMessages.length - 1].chatUser.userId)).userId : '';
        
        resultObjects.push({
          chatId: chatResult.chatId,
          avatar: chatResult.avatar,
          name: chatName,
          isAnyUserOnline,
          lastUsersActivityDatesArray,
          unreadMessagesAmount: chatMessages.length,
          lastUnreadMessage,
          lastUnreadMessageAuthor,
          lastUnreadMessageAuthorId
        });
      }

      res.status(200).json(resultObjects);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error('Error fetching user chats:', error);
    res.status(500).json({ error: 'Error retrieving user chats' });
  }
};

const getFriendsOfGivenUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const friendships = await prisma.friendships.findMany({
      where: {
        OR: [
          { userId },
          { friendId: userId },
        ],
      },
    });

    const uniqueFriendships = await Promise.all(friendships.map(async (friendship) => {
      const friendId = [friendship.friendId, friendship.userId];
      const filtredFriendId = friendId.filter(id => id !== userId);
      const friendUserData = await prisma.user.findFirst({
        where: {
          userId: filtredFriendId[0]
        }
      });

      return {
        friendshipId: friendship.friendshipId,
        userId: friendship.userId,
        friendUserData: friendUserData,
        friendId: friendship.friendId,
        createdAt: friendship.createdAt,
      };
    }));

    return res.status(200).json(uniqueFriendships);

  } catch (error) {
    console.error('Error fetching friendships:', error);
    return res.status(500).json({ message: 'An error occurred while fetching friendships.' });
  }
};

module.exports = { findUserChat, getFriendsOfGivenUser };
