import express from "express";

import { SubmitTicketFunction } from "../controllers/user-controllers.js";

const UserRouter = express.Router();

UserRouter.post("/submit-ticket", SubmitTicketFunction);

export default UserRouter;
