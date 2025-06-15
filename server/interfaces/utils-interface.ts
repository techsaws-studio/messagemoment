import { Request } from "express";

export interface IPGeoData {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
}

export interface SessionTokenPayload {
  sessionId: string;
  username: string;
  userId: string;
  assignedColor: number;
  sessionType: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  sessionData?: SessionTokenPayload;
}
