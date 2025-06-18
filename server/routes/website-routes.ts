import express from "express";

import {
    WebsiteCheckupFunction
} from "../controllers/website-controllers.js";

const WebsiteRouter = express.Router();

// API PATHS
WebsiteRouter.get("/website-health", WebsiteCheckupFunction);

export default WebsiteRouter;
