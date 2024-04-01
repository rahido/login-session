import { FC, ReactNode } from "react";
// import { getSessionIsValid } from "./client/CookieManager.cjs";
import { getSessionIsValid } from "./client/CookieManager.mjs";
import { Navigate } from "react-router-dom";

// GuestGuard is for pages that's not to be shown for logged in user (like login / sign up)
// --> redirects (logged in) user to landing page if trying to navigate to login/signup

// React.FC is a type that stands for "Function Component" in React.
// function returns <></>

interface GuestGuardProps {
  children: ReactNode;
}

const GuestGuard: FC<GuestGuardProps> = ({ children }) => {
  if (!getSessionIsValid()) {
    return <>{children}</>;
  }
  return <Navigate to="/" />;
};

export default GuestGuard;
