import { sign, verify, decode } from 'jsonwebtoken';
import process from 'node:process';
import { CustomJwt } from '../../@types/jwt';
import { KSTtime } from './KSTtime';

const verifyToken = (
  token: string,
  isRefreshToken: boolean = false
): Promise<CustomJwt> => {
  return new Promise((resolve, reject) => {
    const jwtSecret = isRefreshToken
      ? process.env.JWT_REFRESH!
      : process.env.JWT_SECRET!;
    verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        reject(err);
      } else resolve(decoded as CustomJwt);
    });
  });
};

const decodeToken = (token: string) => {
  return decode(token) as CustomJwt;
};

const accessToken = (name: string, userId: number) => {
  const jwtSercet = process.env.JWT_SECRET!;
  const iat = KSTtime().getTime() / 1000;
  const token = sign(
    {
      index: userId,
      userName: name,
      iat: iat
    },
    jwtSercet,
    {
      issuer: name,
      expiresIn: '6h'
    }
  );
  return token;
};

const refreshToken = (name: string, userId: number) => {
  const jwtRefresh = process.env.JWT_REFRESH!;
  const iat = KSTtime().getTime() / 1000;

  const token = sign(
    {
      index: userId,
      userName: name,
      iat: iat
    },
    jwtRefresh,
    {
      issuer: name,
      expiresIn: '180d'
    }
  );
  return token;
};

export { accessToken, verifyToken, refreshToken, decodeToken };
