import { v4 } from 'uuid';
import { comparePassword, hashPassword } from '../tools/crypto.js';
import { bootstrapTasks } from '../tasks/tasks.controller.js';

let userDatabase = {};

const registerUser = async (username, password) => {
  const hashedPassword = await hashPassword(password);
  const userId = v4();

  userDatabase[userId] = {
    username,
    password: hashedPassword,
  };

  bootstrapTasks(userId);
};

const getUser = (userId) => userDatabase[userId];
const getUserIdFromUsername = (username) => Object.keys(userDatabase)
  .find((id) => userDatabase[id].username === username);

const checkUserCredentials = (username, password) => {
  const userId = getUserIdFromUsername(username);
  const user = getUser(userId);
  if (!user) {
    return undefined;
  }

  return comparePassword(password, user.password);
};

const clearUsers = () => {
  userDatabase = {};
};

export {
  registerUser, getUser, getUserIdFromUsername, checkUserCredentials, clearUsers,
};
