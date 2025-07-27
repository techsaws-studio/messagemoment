export interface AIResearchCompanionMessagePayload {
  sessionId: string;
  username: string;
  message: string;
}

export interface JoinRoomPayload {
  sessionId: string;
  sessionSecurityCode?: string;
  username: string;
  fingerprint?: string;
}

export interface ProjectModePayload {
  sessionId: string;
  username: string;
  command?: string;
}

export interface RemoveUserPayload {
  sessionId: string;
  username: string;
  targetUsername: string;
}

export interface SendMessagePayload {
  sessionId: string;
  username: string;
  message: string;
}

export interface GetUserListPayload {
  sessionId: string;
}

export interface SocketUserInfo {
  username: string;
  sessionId: string;
}

export interface ReconnectPayload {
  sessionId: string;
  username: string;
  fingerprint?: string;
}
