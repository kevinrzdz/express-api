import { compare, hash } from 'bcrypt'

const hashPassword = async (plainTextPwd) => hash(plainTextPwd, 10)

const comparePassword = async (plainTextPwd, hashPwd) => compare(plainTextPwd, hashPwd)

export { hashPassword, comparePassword }
