const prisma = require('../prismaClient');

async function createUser(userData) {
  return await prisma.user.create({
    data: userData,
  });
}

async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

async function loginUser(email, password) {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error('User not found');
  }

  if (user.password !== password) {
    throw new Error('Invalid password');
  }

  const updatedUser = await prisma.user.update({
    where: {
      userId: user.userId,
    },
    data: {
      isOnline: true,
    },
  });

  return updatedUser;
}

async function logoutUser(userId) {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const updatedUser = await prisma.user.update({
    where: {
      userId: userId,
    },
    data: {
      isOnline: false,
    },
  });

  return updatedUser;
}

async function findUserById(userId) {
  return await prisma.user.findUnique({
    where: { userId },
  });
}

module.exports = { createUser, findUserByEmail, loginUser, findUserById, logoutUser };
