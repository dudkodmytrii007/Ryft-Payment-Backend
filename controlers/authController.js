const userModel = require('../models/userModel');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.loginUser(email, password);

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await userModel.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user' });
  }
};

module.exports = { loginUser, getUserById };
