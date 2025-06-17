//Backend/src/utils/token.ts
import jwt from 'jsonwebtoken';


const ACCESS_SECRET = "secret123";
export const generateToken = (userID: string) => {
    return jwt.sign(
        { userID},
        ACCESS_SECRET,
        {
            expiresIn: '15m'
        }
    )
}

export const accessVerifyToken = (token: string) => {
    return jwt.verify(token, ACCESS_SECRET) as { userId: string };
};

export const verifyAccessToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as { userId: string };
  } catch (err) {
    return null;
  }
};