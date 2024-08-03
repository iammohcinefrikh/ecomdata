import crypto from "crypto";

const hashPassword = (userPassword: string) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(userPassword, salt, 1000, 64, "sha512").toString("hex");
  
  return [salt, hash].join("$");
}

export default hashPassword;