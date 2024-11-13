const prisma = require('../prismaClient');

const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
  });
};

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.password !== password) {
    throw new Error('Invalid password');
  }

  return user;
};

const findUserById = async (userId) => {
  return await prisma.user.findUnique({
    where: { userId },
  });
};

module.exports = { createUser, findUserByEmail, loginUser, findUserById };
