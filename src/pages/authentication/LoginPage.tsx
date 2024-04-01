// login Icons
import imgEmail from "../../assets/Login/email.png";
import imgPassword from "../../assets/Login/password.png";

// React modules
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Client modules
import { setCookies } from "../../client/CookieManager.mjs";
import { loginUser } from "../../client/ClientAuthentication.mjs";
import { loginDataObject } from "../../server/AuthenticationVars.mjs";
// CSS styles
import "../defaultStyles/defaultStyles.css";

const LoginPage = () => {
  // useStates
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  // Navigate
  const navigate = useNavigate();

  // Login / signup requests
  // runs loginUser() -> returns {userData and sessionIds}
  async function clickLogIn() {
    let loginData: typeof loginDataObject;
    // LoginRequest.js -> loginUser
    await loginUser(email, password)
      .then((data) => {
        loginData = data; // {typeof loginDataObject}
        console.log("ClickLogin - finished - got response : loginDataObject: ");
        console.dir(loginData);
        setCookies(loginData.userId, loginData.sessionIds);
      })
      .then(() => {
        console.log("After Log in - Navigate to /");
        // navigate("/home");
        // TEST if location.state.key could be used for making toasts when some page opens
        navigate("/home", { state: { key: "loginRedirect" } });
        // toast("Signed in!");  // Won't show this as the page changes
      })
      .catch((err) => {
        console.log("LoginPage - ClickLogin error: " + err);
        setLoginMsg(err.toString());
        toast(err);
      });
  }

  const updatePassword = (event: any) => {
    setPassword(event.target.value);
    setLoginMsg("");
  };
  const updateEmail = (event: any) => {
    setEmail(event.target.value);
    setLoginMsg("");
  };

  return (
    <>
      <div className="fixed-bg"></div>
      <div className="container">
        <ToastContainer />
        <div className="header">
          <div className="text">Login</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <img src={imgEmail} alt="email icon" />
            <input
              type="email"
              placeholder="Email"
              //value={email}
              onChange={updateEmail}
            />
          </div>
          <div className="input">
            <img src={imgPassword} alt="password icon" />
            <input
              type="password"
              placeholder="Password"
              //value={password}
              onChange={updatePassword}
            />
          </div>
        </div>
        <div className="help-link">
          Don't have an account?
          <span
            onClick={() => {
              navigate("/signup");
            }}
          >
            Sign up
          </span>
        </div>
        <div className="info-msg">
          <p key="info-msg">{loginMsg}</p>
        </div>
        <div className="submit-container">
          <div className="submit" onClick={clickLogIn}>
            Login
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
