import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  const saltRounds = await bcrypt.genSalt(parseInt(process.env.saltRounds));
  let hashedPwd = await bcrypt.hash(password, saltRounds);

  return hashedPwd;
};

export const comparePassword = async (password, hashedPassword) => {
  let isPwdMatch = await bcrypt.compare(password, hashedPassword);

  return isPwdMatch;
};
