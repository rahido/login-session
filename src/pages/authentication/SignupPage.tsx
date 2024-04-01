// login Icons
import imgEmail from "../../assets/Login/email.png";
import imgPassword from "../../assets/Login/password.png";
import imgUser from "../../assets/Login/person.png";

// React modules
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Client modules
import { signUpUser } from "../../client/ClientAuthentication.mjs";
// CSS styles
import "../defaultStyles/defaultStyles.css";

const SignupPage = () => {
  // Browser time out test
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     console.log("This will run after 5 second!");
  //   }, 5000);
  //   return () => clearTimeout(timer);
  // }, []);

  // useStates
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  // Navigate
  const navigate = useNavigate();

  async function clickSignUp() {
    // Receives {msg=""} or (error)
    await signUpUser(userName, email, password)
      .then((data: Object | any) => {
        console.log("ClickLogin - finished - got response : data: ");
        console.dir(data);
        setLoginMsg(data.msg.toString());
        navigate("/login");
        // toast("Account created!"); // Won't show as page changes
      })
      .catch((err) => {
        console.log("SignupPage - clickSignUp error: " + err);
        setLoginMsg(err.toString());
        toast(err);
      });
  }

  // Hooks
  const updateUserName = (event: any) => {
    setUserName(event.target.value);
    setLoginMsg("");
  };
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
        <div className="header">
          <div className="text">Sign up</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <img src={imgUser} alt="user icon" />
            <input
              type="text"
              placeholder="Username"
              //value={userName}
              onChange={updateUserName}
            />
          </div>
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
          Already have an account?
          <span onClick={() => navigate("/login")}>Login</span>
        </div>
        <div className="info-msg">
          <p key="info-msg">{loginMsg}</p>
        </div>
        <div className="submit-container">
          <div className="submit" onClick={clickSignUp}>
            Sign Up
          </div>
          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default SignupPage;
