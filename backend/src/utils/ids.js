import crypto from "crypto";
export const uid = () => (crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex"));
export const token = (n = 48) => crypto.randomBytes(n).toString("base64url");
