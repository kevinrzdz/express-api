import { hash, compare } from 'bcrypt';

const hashPassword = async (plainTextPwd) => {
  const hashedPwd = await hash(plainTextPwd, 10);
  return hashedPwd;
};

const comparePassword = async (plainTextPwd, hashPwd) => {
  const passwordsMatch = await compare(plainTextPwd, hashPwd);
  return passwordsMatch;
};

export { hashPassword, comparePassword };
