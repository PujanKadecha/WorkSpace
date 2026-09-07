const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
require("dotenv").config();

const registerUser = async ({ email, password, name }) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });
  return { userId: user.id, userID: user.id };
};

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "8h" },
  );

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
};

module.exports = { registerUser, loginUser };
