const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function seedDatabase() {
  await prisma.chatUser.deleteMany({});
  await prisma.chatMessage.deleteMany({});
  await prisma.chat.deleteMany({});
  await prisma.friendships.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('All data has been deleted from tables.');

  const users = [];
  for (let i = 0; i < 20; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        avatar: faker.image.avatar(),
        userId: uuidv4(),
        isOnline: false,
      },
    });
    users.push(user);
  }

  console.log(`${users.length} users created.`);

  const chats = [];
  for (let i = 0; i < 5; i++) {
    const chatNameType = faker.number.int({ min: 1, max: 2 });

    const chat = await prisma.chat.create({
      data: {
        chatId: uuidv4(),
        name: chatNameType === 1 ? faker.lorem.words(4) : '',
        avatar: faker.image.avatar(),
      },
    });

    chats.push(chat);
  }

  console.log(`Chats created`);

  for (let i = 0; i < chats.length; i++) {
    const amountOfUsers = faker.number.int({ min: 3, max: 5 });
    const pickedChat = chats[i];
    const pickedUsers = faker.helpers.shuffle(users).slice(0, amountOfUsers);

    const chatUsers = [];
    for (let pickedUser of pickedUsers) {
      const chatUser = await prisma.chatUser.create({
        data: {
          chatId: pickedChat.chatId,
          userId: pickedUser.userId,
          isViewed: false,
        },
      });
      chatUsers.push(chatUser);
    }

    for (let chatUser of chatUsers) {
      const amountOfMessages = faker.number.int({ min: 1, max: 5 });
      for (let k = 0; k < amountOfMessages; k++) {
        await prisma.chatMessage.create({
          data: {
            message: faker.lorem.sentence(),
            chat: {
              connect: {
                chatId: pickedChat.chatId,
              }
            },
            chatUser: {
              connect: {
                chatUserId: chatUser.chatUserId,
              }
            },
          },
        });
      }
    }
  }

  for (const user of users) {
    const friendIds = getRandomFriends(users, user.userId, 4, 6);

    for (const friendId of friendIds) {
      const existingFriendship = await prisma.friendships.findFirst({
        where: {
          OR: [
            { userId: user.userId, friendId },
            { userId: friendId, friendId: user.userId },
          ],
        },
      });

      if (!existingFriendship) {
        await prisma.friendships.create({
          data: {
            friendshipId: uuidv4(),
            userId: user.userId,
            friendId: friendId
          }
        })
      }
    }
  }

  function getRandomFriends(users, currentUserId, min, max) {
    const otherUsers = users.filter(user => user.userId !== currentUserId);
    const numFriends = faker.number.int({ min, max });
    const shuffled = faker.helpers.shuffle(otherUsers);
    return shuffled.slice(0, numFriends).map(user => user.userId);
  }

  console.log('Seeding complete!');
}

module.exports = { seedDatabase };
