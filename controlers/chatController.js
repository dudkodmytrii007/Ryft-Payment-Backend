const { PrismaClient } = require('@prisma/client');
const { findUserById } = require('../models/userModel');
const prisma = new PrismaClient();

async function findUserChat(req, res) {
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
        let isOnline = false;
        let lastActivity = '';
        let chatMessages = [];
        let chatType = '';

        if (chatResult.name === '') {
          let isOnline = false;
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
                isOnline = true;
              }

              usersLastActivityDate.push(chatUser.lastViewedDate);

              return foundChatUser.name;
            })
          );

          chatName = chatUsersNames.join(', ');
          isOnline = this.isOnline;
          usersLastActivityDate.sort((a, b) => new Date(b) - new Date(a));
          lastActivity = usersLastActivityDate.slice(0, 1)[0];
        } else {
          chatName = chatResult.name;
        }

        const chatUsers = await prisma.chatUser.findMany({
          where: {
            chatId: chatResult.chatId,
          },
        });

        chatType = chatUsers.filter((chatUser) => chatUser.userId != userId).length > 1 ? 'group' : 'private';

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

        const lastMessage = (chatMessages.length > 0) ? chatMessages[chatMessages.length - 1].message : '';
        const lastMessageTimeStamp = (chatMessages.length > 0) ? chatMessages[chatMessages.length - 1].createdAt : '';
        const lastAuthor = (chatMessages.length > 0) ? (await findUserById(chatMessages[chatMessages.length - 1].chatUser.userId)).name : '';
        const lastAuthorId = (chatMessages.length > 0) ? (await findUserById(chatMessages[chatMessages.length - 1].chatUser.userId)).userId : '';
        
		let isChatHidden = await prisma.chatUser.findFirst({
			where: {
				userId: userId,
				chatId: chatResult.chatId
			}
		}).then((foundUserChatInstance) => foundUserChatInstance.isHidden);

        resultObjects.push({
          chatId: chatResult.chatId,
          avatar: chatResult.avatar,
          name: chatName,
          chatType,
          isOnline,
          lastActivity,
          unreadMessagesAmount: chatMessages.length,
          lastMessage,
		  lastMessageTimeStamp,
          lastAuthor,
          lastAuthorId,
		  isHidden: isChatHidden
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
}

async function getFriendsOfGivenUser(req, res) {
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
}

async function toggleUserInChatVisibility(req, res) {
	const { userId, chatId } = req.body;
  
	try {
	  const foundChatUser = await prisma.chatUser.findFirst({
		where: {
		  chatId: chatId,
		  userId: userId
		}
	  });
  
	  if (!foundChatUser) {
		return res.status(404).json({
		  message: "ChatUser not found"
		});
	  }
  
	  const updatedChatUser = await prisma.chatUser.update({
		where: {
		  chatUserId: foundChatUser.chatUserId
		},
		data: {
		  isHidden: !foundChatUser.isHidden
		}
	  });
  
	  res.status(200).json();
	} catch (error) {
	  console.error(error);
	  res.status(500).json({
		message: "Something went wrong"
	  });
	}
  }
  
async function getProfileData(req, res) {
	const { userId } = req.body;

	const foundUser = await prisma.user.findFirst({
		where: {
			userId: userId
		}
	})

	if (foundUser) {
		const transformedFoundUser = {
			userId: foundUser.userId,
			name: foundUser.name,
			avatar: foundUser.avatar,
			baner: foundUser.baner,
			isOnline: foundUser.isOnline,
		}

		return res.status(200).json(transformedFoundUser);
	}
	else {
		return res.status(404).json();
	}
}

async function getAllUsersFromChat(req, res) {
	const { chatId } = req.body;

	try {
		const chatExists = await prisma.chat.findUnique({
			where: { chatId },
		});

		if (!chatExists) {
			return res.status(404).json({ message: 'Chat not found' });
		}

		const users = await prisma.chatUser.findMany({
			where: { chatId },
			include: {
				user: true,
			},
		});

		const userDetails = users.map((chatUser) => ({
			userId: chatUser.user.userId,
			name: chatUser.user.name,
			avatar: chatUser.user.avatar,
			isOnline: chatUser.user.isOnline,
		}));

		res.status(200).json(userDetails);
	} catch (error) {
		console.error('Error fetching users from chat:', error);
		res.status(500).json({ message: 'An error occurred while fetching users from the chat.' });
	}
}

async function toggleUserInChatHiddenState(req, res) {
	const { userId, chatId } = req.body;

	try {
		const chatUser = await prisma.chatUser.findFirst({
			where: {
				userId: userId,
				chatId: chatId,
			},
		});

		if (!chatUser) {
			return res.status(404).json({ message: 'Chat user not found.' });
		}

		const visibilityState = await prisma.chatUserVisibilityState.findUnique({
			where: {
				chatUserId: chatUser.chatUserId,
			},
		});

		if (!visibilityState) {
			return res.status(404).json({ message: 'Visibility state not found.' });
		}

		const updatedState = await prisma.chatUserVisibilityState.update({
			where: {
				chatUserId: chatUser.chatUserId,
			},
			data: {
				state: !visibilityState.state,
				lastUpdatedAt: new Date(),
			},
		});

		return res.status(200).json({
			message: 'Visibility state toggled successfully.',
			newState: updatedState.state,
		});
	} catch (error) {
		console.error('Error toggling visibility state:', error);
		return res.status(500).json({ message: 'Internal server error.' });
	}
}

async function createChat(req, res) {
	const userIds = req.body.userIds;
	const chatType = userIds.length >= 3 ? "group" : "private";

	try {
		if (chatType === "private" && userIds.length === 2) {
			const existingChat = await prisma.chat.findFirst({
				where: {
					type: "private",
					chatUsers: {
						every: {
							userId: { in: userIds },
						},
					},
					AND: [
						{
							chatUsers: {
								some: { userId: userIds[0] },
							},
						},
						{
							chatUsers: {
								some: { userId: userIds[1] },
							},
						},
					],
				},
				include: {
					chatUsers: true,
				},
			});

			if (existingChat && existingChat.chatUsers.length === 2) {
				return res.status(400).json({
					message: "Private chat already exists between these two users",
				});
			}
		}

		const userNames = await prisma.user.findMany({
			where: {
				userId: { in: userIds },
			},
			select: {
				name: true,
			},
		});

		const chatName = chatType === "group"
			? "Group Chat"
			: `Private Chat (${userNames.map(user => user.name).join(", ")})`;

		const newChat = await prisma.chat.create({
			data: {
				name: chatName,
				type: chatType,
			},
		});

		for (let i = 0; i < userIds.length; i++) {
			const userId = userIds[i];

			const user = await prisma.user.findUnique({
				where: { userId },
			});

			if (!user) {
				return res.status(404).json({ message: `User with ID ${userId} not found` });
			}

			const role = i === 0 ? "owner" : "user";

			await prisma.chatUser.create({
				data: {
					chatId: newChat.chatId,
					userId,
					isViewed: false,
					visibilityState: {
						create: {
							state: true,
						},
					},
					role,
				},
			});
		}

		return res.status(201).json({
			message: "Chat created successfully",
			chat: newChat,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
}

async function removeChat(req, res) {
	const { userId, chatId } = req.body;

	try {
		const chatUser = await prisma.chatUser.findFirst({
			where: {
				chatId,
				userId,
				role: "owner",
			},
		});

		if (!chatUser) {
			return res.status(403).json({
				message: "You are not the owner of this chat or not a part of it.",
			});
		}

		await prisma.ChatUserVisibilityState.deleteMany({
			where: {
				chatUser: {
					chatId,
				},
			},
		});

		await prisma.chatMessage.deleteMany({
			where: {
				chatId,
			},
		});

		await prisma.chatUser.deleteMany({
			where: {
				chatId,
			},
		});

		await prisma.chat.delete({
			where: {
				chatId,
			},
		});

		return res.status(200).json({
			message: "Chat and all related records successfully deleted.",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
}


module.exports = { 
	findUserChat, 
	getFriendsOfGivenUser, 
	toggleUserInChatVisibility, 
	getProfileData, 
	getAllUsersFromChat, 
	toggleUserInChatHiddenState, 
	createChat,
	removeChat
};
