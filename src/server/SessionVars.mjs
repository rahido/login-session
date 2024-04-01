// DB & Table for sessions
export const sessionsDbPath = './src/db/sessions.db';
export const sessionsDbTable = 'sessions';

// Object type for server to send to client (when client is requesting current session)
export const sessionCheckObject = {
    sessionIds: {
      sessionId: "",
      sessionExpire: "",
      refreshId: "",
      refreshExpire: "",
    },
    updated: false,
    msg: "",
  };
