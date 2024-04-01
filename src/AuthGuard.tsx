import { FC, ReactNode } from "react";
import { getSessionIsValid } from "./client/CookieManager.mjs";

import { Navigate } from "react-router-dom";
// https://dev.to/elhamnajeebullah/react-typescript-what-is-reactfc-and-why-should-i-use-it-4029
// React.FC is a type that stands for "Function Component" in React. It is a generic type that allows you to specify the props that a function component will accept

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  console.log("AuthGuard --> check if signed in -session is valid");

  if (!getSessionIsValid()) {
    // return <LoginPage />;
    return <Navigate to="/login" />;
  }

  // Return the page component that was intended by user (element children of any <AuthGuard> in routes.tsx)
  return <>{children}</>;
};

export default AuthGuard;
