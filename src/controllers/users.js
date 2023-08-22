import { v4 } from 'uuid';
import { hashPassword, comparePassword } from '../crypto.js';

const userDatabase = {};

const registerUser = async (username, password) => {
  const hashedPassword = await hashPassword(password);
  userDatabase[v4()] = {
    username,
    password: hashedPassword,
  };
};

const getUserFromUsername = (username) => {
  const userId = Object.keys(userDatabase).find((id) => userDatabase[id].username === username);
  return userDatabase[userId];
};

const checkUserCredentials = async (username, password) => {
  const user = getUserFromUsername(username);
  if (!user) {
    return undefined;
  }

  const passwordsMatch = await comparePassword(password, user.password);
  return passwordsMatch;
};

export { registerUser, checkUserCredentials };
