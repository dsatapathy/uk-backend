import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errors.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

app.get("/health", (_req, res) => res.send("OK"));

app.use("/api", routes);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

export default app;
