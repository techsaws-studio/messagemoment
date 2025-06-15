import { Request, Response, NextFunction } from "express";

// WELCOME ROUTE HANDLER
export const WelcomeRouteFunction = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to MessageMoment backend.",
  });
};

// NOT FOUND ROUTE HANDLER
export const UnknownRouteFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const err: any = new Error(`Route ${req.originalUrl} not found.`);
  err.statusCode = 404;
  next(err);
};
