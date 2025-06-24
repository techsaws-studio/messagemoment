import express from "express";

import {
  BasicPingFunction,
  RootEndpointFunction,
} from "../controllers/basic-controllers.js";

const BasicRouter = express.Router();

BasicRouter.get("/", RootEndpointFunction);
BasicRouter.get("/ping", BasicPingFunction);

export default BasicRouter;
