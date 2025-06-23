import { Document } from "mongoose";

import { SessionTypeEnum } from "../enums/session-enum.js";
import { TicketTopicEnum } from "enums/ticket-enum.js";

export interface IMessage extends Document {
  sessionId: string;
  username: string;
  message: string;
  timestamp: number;
  displayExpiresAt?: Date;
  isSystemMessage?: boolean;
  isAIMessage?: boolean;
  createdAt: Date;
  updatedAt: Date;
  isPermanent: boolean;
}

export interface IParticipant extends Document {
  sessionId: string;
  userId: string;
  username: string;
  participantIp: string;
  telcomProvider: string;
  participantLocation: {
    longitude: number;
    latitude: number;
    city: string;
    country: string;
  };
  device: string;
  browser: string;
  sessionDuration: number;
  sessionCount: number;
  assignedColor: number;
  hasLockedSession: boolean;
  isActive: boolean;
  hasLeftSession: boolean;
  fingerprint?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ISession extends Document {
  sessionId: string;
  sessionType: SessionTypeEnum;
  sessionSecurityCode?: string;
  sessionIp: string;
  sessionLocation: {
    longitude: number;
    latitude: number;
    city: string;
    country: string;
  };
  metadata?: {
    projectModeActivator?: string;
    [key: string]: any;
  };
  participantCount: number;
  sessionTimer: number;
  isExpirationTimeSet: boolean;
  timerSetBy?: string;
  isProjectModeOn: boolean;
  sessionLocked: boolean;
  participants: Array<{
    userId: string;
    username: string;
    assignedColor: number;
    joinedAt: Date;
  }>;
  projectModeEnabledAt?: number;
  projectModeDisabledAt?: number;
  sessionExpired: boolean;
  messageClearHistory?: Array<{
    clearedAt: number;
    clearedBy: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITimerChange {
  changeId: string;
  sessionId: string;
  timestamp: number;
  setBy: string;
  newTimerValue: number;
  previousTimerValue: number;
}

export interface ITicket extends Document {
  ticketId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  topic: TicketTopicEnum;
  query: string;
  userIp: string;
  userLocation: {
    longitude: number;
    latitude: number;
    city: string;
    country: string;
  };
  createdAt: Date;
}