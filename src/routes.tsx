// Routes for pages. // lazy loading with loading screen.
import { Suspense, lazy } from "react";
import LoadingScreen from "./components/LoadingScreen";
import type { RouteObject } from "react-router";
import LandingPage from "./pages/landing/LandingPage";
import AuthGuard from "./AuthGuard";
import GuestGuard from "./GuestGuard";

// Routes tutorial. Includes AuthGuard and GuestGuard
// https://medium.com/@ahsan-ali-mansoor/define-react-routes-with-better-approach-typescript-d07de782b517
// "The lazy component should then be rendered inside a Suspense component, which allows us to show some fallback content (such as a loading indicator) while we’re waiting for the lazy component to load."

// More on auth:
// https://stackoverflow.com/questions/49819183/react-what-is-the-best-way-to-handle-login-and-authentication

// more on routes auth
// https://dev.to/sanjayttg/jwt-authentication-in-react-with-react-router-1d03

const Loadable = (Component: any) => (props: JSX.IntrinsicAttributes) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// Authentication pages
const Login = Loadable(lazy(() => import("./pages/authentication/LoginPage")));
const Signup = Loadable(
  lazy(() => import("./pages/authentication/SignupPage"))
);

// Home page
const Home = Loadable(lazy(() => import("./pages/home/HomePage")));

const routes: RouteObject[] = [
  {
    path: "home",
    element: (
      <AuthGuard>
        {" "}
        <Home />
      </AuthGuard>
    ),
  },
  {
    path: "login",
    element: (
      <GuestGuard>
        {" "}
        <Login />
      </GuestGuard>
    ),
  },
  {
    path: "signup",
    element: (
      <GuestGuard>
        {" "}
        <Signup />
      </GuestGuard>
    ),
  },
  {
    path: "*",
    element: <LandingPage />,
    children: [{ index: true, element: <LandingPage /> }],
  },
];

export default routes;
