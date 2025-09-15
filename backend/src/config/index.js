import "dotenv/config";

export const config = {
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "dev_access_secret_change_me",
  ACCESS_TTL: process.env.ACCESS_TTL || "10m",
  REFRESH_TTL_MS: Number(process.env.REFRESH_TTL_MS || 7 * 24 * 60 * 60 * 1000),
  PORT: Number(process.env.PORT || 3000),
};
