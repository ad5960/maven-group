
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next';
import dynamoDb from './dynamodb';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  inputPassword: string,
  storedHash: string
): Promise<boolean> {
  return await bcrypt.compare(inputPassword, storedHash);
}

export function generateToken(email: string): string {
  return jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
}

export function verifyToken(token: string): string | jwt.JwtPayload {
  return jwt.verify(token, process.env.JWT_SECRET!);
}

export async function getUserByEmail(email: string) {
  const params = {
    TableName: 'Admin',
    Key: {
      email,
    },
  };
  const result = await dynamoDb.get(params).promise();
  return result.Item;
}
