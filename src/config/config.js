import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 8000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD || ""
export const NODE_ENV = process.env.NODE_ENV || ""