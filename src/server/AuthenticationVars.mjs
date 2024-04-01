// DB & Table for users
export const usersDbPath = './src/db/users.db';
export const usersTable = 'users';

// Object type for server to send to client (when client is requesting authentication / log in)
export const loginDataObject = {
    userId: "",
    sessionIds: {
      sessionId: "",
      sessionExpire: "",
      refreshId: "",
      refreshExpire: "",
    },
};