import express from "express";

import {
  HealthCheckFunction,
  BasicPingFunction,
  RootEndpointFunction,
} from "../controllers/basic-controllers.js";

const BasicRouter = express.Router();

BasicRouter.get("/", RootEndpointFunction);
BasicRouter.get("/ping", BasicPingFunction);
BasicRouter.get("/health", HealthCheckFunction);

export default BasicRouter;
