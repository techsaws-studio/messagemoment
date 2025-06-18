import "dotenv/config";

import express, { NextFunction, Request, Response, urlencoded } from "express";
import cookieParser from "cookie-parser";

import { AppErrorHandler } from "./middlewares/app-error-handler.js";
import { CorsConfiguration } from "middlewares/cors-configuration.js";

import BasicRouter from "./routes/basic-routes.js";
import SessionRouter from "./routes/session-routes.js";
import WebsiteRouter from "./routes/website-routes.js";

export const app = express();

// SERVER CONFIGURATIONS
app.use(CorsConfiguration);
app.use(express.json({ limit: "50mb" }));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// API ROUTES
app.use("/api/v1", SessionRouter, WebsiteRouter);

// BASIC ROUTES
app.use("", BasicRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  AppErrorHandler(err, req, res, next);
});
