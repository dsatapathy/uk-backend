import { createServer } from "http";
import app from "./app.js";
import { config } from "./config/index.js";

const server = createServer(app);
server.listen(config.PORT, () => {
  console.log(`API listening on http://localhost:${config.PORT}`);
  console.log(`Demo users -> admin/admin123, employee/welcome123`);
});
