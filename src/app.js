import express from "express";
import routes from "./routes/index.js";
import { logger } from "./middlewares/logger.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(logger);

app.use("/api", routes);

export default app;