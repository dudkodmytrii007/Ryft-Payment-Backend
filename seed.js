const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function seedDatabase() {
  await prisma.chatUser.deleteMany({});
  await prisma.chatMessage.deleteMany({});
  await prisma.chat.deleteMany({});
  await prisma.userFriends.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('All data has been deleted from tables.');

  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        avatar: faker.image.avatar(),
        userId: uuidv4(),
      },
    });
    users.push(user);
  }

  console.log(`${users.length} users created.`);

  for (let i = 0; i < users.length; i++) {
    const user1 = users[i];
    const user2 = users[(i + 1) % users.length]; // Loop to connect users in pairs

    await prisma.userFriends.create({
      data: {
        userId: user1.userId,
        friendId: user2.userId,
      },
    });
    console.log(`Friendship created between ${user1.name} and ${user2.name}`);
  }

  const chat = await prisma.chat.create({
    data: {
      name: faker.lorem.words(3),
      avatar: '',
    },
  });

  console.log(`Chat created: ${chat.name}`);

  for (let i = 0; i < 10; i++) {
    const message = await prisma.chatMessage.create({
      data: {
        chatId: chat.chatId,
        userId: users[faker.number.int({ min: 0, max: users.length - 1 })].userId,
        chatUsers: {
          create: {
            chatId: chat.chatId,
            userId: users[faker.number.int({ min: 0, max: users.length - 1 })].userId,
            isViewed: faker.datatype.boolean(),
          },
        },
      },
    });
    console.log(`Message created by User ${message.userId} in Chat ${chat.chatId}`);
  }

  console.log('Seeding complete!');
}

module.exports = { seedDatabase };
