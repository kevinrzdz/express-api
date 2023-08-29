import { v4 } from 'uuid';
import { comparePassword, hashPassword } from '../crypto.js';

let userDatabase = {};

const registerUser = async (username, password) => {
  const hashedPassword = await hashPassword(password);
  userDatabase[v4()] = {
    username,
    password: hashedPassword,
  };
};

const getUserFromUsername = (username) => {
  const userId = Object.keys(userDatabase)
    .find((id) => userDatabase[id].username === username);
  return userDatabase[userId];
};

const checkUserCredentials = async (username, password) => {
  const user = getUserFromUsername(username);
  if (!user) {
    return undefined;
  }

  return comparePassword(password, user.password);
};

const clearUsers = () => {
  userDatabase = {};
};

export { registerUser, checkUserCredentials, clearUsers };
