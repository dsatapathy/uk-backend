import { uid } from "../utils/ids.js";

const usersByUsername = new Map([
  ["admin",   { id: "u_1", username: "admin",    password: "admin123",    name: "Admin User",    roles: ["admin"],    email: "admin@example.com" }],
  ["employee",{ id: "u_2", username: "employee", password: "welcome123",  name: "Employee One",  roles: ["employee"], email: "employee@example.com" }],
]);

export function toPublic(u) {
  return { id: u.id, username: u.username, name: u.name, email: u.email, roles: u.roles };
}

export const UsersRepo = {
  findByUsername(username) {
    return usersByUsername.get(String(username || "").trim()) || null;
  },
  findById(id) {
    for (const u of usersByUsername.values()) if (u.id === id) return u;
    return null;
  },
  create({ username, password, name, roles = [], email }) {
    const id = uid();
    const u = { id, username, password, name, roles, email };
    usersByUsername.set(username, u);
    return u;
  },
};
