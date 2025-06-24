import express from "express";

import { ServerHealthFunction } from "../controllers/system-controllers.js";

const SystemRouter = express.Router();

SystemRouter.get("/server-status", ServerHealthFunction);

export default SystemRouter;
