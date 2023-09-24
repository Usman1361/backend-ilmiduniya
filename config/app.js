export const { MONGO_URL, NODE_ENV, PORT, BCRYPT_SALT, JWT_SECRET } =
  process.env;

export const IN_PROD = NODE_ENV === "production";
