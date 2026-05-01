const User = require('../models/User');

const getUsers = async () => {
  return await User.find();
};

const createUser = async (name) => {
  const user = new User({ name });
  return await user.save();
};

module.exports = { getUsers, createUser };
