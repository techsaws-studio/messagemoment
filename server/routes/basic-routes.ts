import express from "express";

import {
  HealthCheckFunction,
  BasicPingFunction,
  RootEndpointFunction,
  CheckMaintenanceStatusFunction,
} from "../controllers/basic-controllers.js";

const BasicRouter = express.Router();

BasicRouter.get("/", RootEndpointFunction);
BasicRouter.get("/ping", BasicPingFunction);
BasicRouter.get("/health", HealthCheckFunction);
BasicRouter.get("/maintenance-status", CheckMaintenanceStatusFunction);

export default BasicRouter;
