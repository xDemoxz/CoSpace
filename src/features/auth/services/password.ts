// Hash de contraseñas con bcrypt.
import bcrypt from "bcryptjs";

const ROUNDS = 10;

export const hashPassword = (password: string): Promise<string> => bcrypt.hash(password, ROUNDS);

export const verifyPassword = (password: string, hash: string): Promise<boolean> =>
  bcrypt.compare(password, hash);
