// React modules
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// client modules
import { makeSessionCheck } from "../../client/ClientSession.mjs";
import { sessionCheckObject } from "../../server/SessionVars.mjs";
import {
  clearUserCookies,
  getCookieValue,
  logPrintAllCookies,
  setCookies,
} from "../../client/CookieManager.mjs";
// CSS styles
import "../defaultStyles/defaultStyles.css";

const HomePage = () => {
  const navigate = useNavigate();
  let location = useLocation();

  function logSessionCookies() {
    console.log("Log Session");
    logPrintAllCookies();
  }

  function logOut(afterSessionExpired: boolean) {
    console.log("HomePage - logOut()");
    clearUserCookies();
    let navTo = afterSessionExpired ? "/login" : "/";
    navigate(navTo);
  }

  async function updateSession() {
    console.log("HomePage - updateSession");
    // ClientSession.js - makeSessionCheck
    await makeSessionCheck(
      getCookieValue("sessionId"),
      getCookieValue("refreshId")
    )
      .then((obj) => {
        // obj : {data: sessionCheckObject, err: ""}
        console.log("HomePage - updateSession - responded with dir:");
        console.dir(obj);

        let sessionObject: typeof sessionCheckObject;
        sessionObject = obj;

        // display message --> Session expired | session refreshed | session still valid
        setInfoMsg(sessionObject.msg.toString());

        // if sessionIds were updated (sessionId expired, but refreshId valid)
        if (sessionObject.updated) {
          let userId = getCookieValue("userId");
          setCookies(userId, sessionObject.sessionIds);
        }
        // If sessionIds weren't updated, returns without changes to cookies
        return;
      })
      .catch((e) => {
        // Returned rejection because:
        // 1) Error at creating new session, OR...
        // 2) session has been expired (as both sessionId and refreshId were too old)
        // --> Log user out. Logged-in session is no longer valid
        console.log("updateSession got responded with an error: " + e);
        setInfoMsg(e.toString()); // info msg won't be seen as the page changes during log out :(
        return logOut(true);
      });
  }

  let [infoMsg, setInfoMsg] = useState<string>("");
  const [showSessionInfoBox, setShowSessionInfoBox] = useState(false);
  const [showRoutesInfoBox, setShowRoutesInfoBox] = useState(false);

  // Toast once if coming from log in
  useEffect(() => {
    if (
      location.state &&
      location.state.key &&
      location.state.key == "loginRedirect"
    ) {
      // console.log("SHOULD TOAST welcome");
      console.log("location.state.key: " + location.state.key);

      // toast("Welcome ! you are logged in");
      //location.state.key = "a";
    }
  }, []);

  return (
    <>
      <div className="fixed-bg"></div>
      <ToastContainer />
      <div className="container">
        <div className="header">
          <div className="text">Home</div>
          <div className="underline"></div>
        </div>
        <div className="btn-group centered padded">
          {/* <div className="submit-container" key="hoverable info boxes"> */}
          <div
            // className="info-hoverable"
            // className="btn btn-primary"
            className={"btn btn-".concat(
              showSessionInfoBox ? "primary" : "secondary"
            )}
            onMouseEnter={() => setShowSessionInfoBox(true)}
            onMouseLeave={() => setShowSessionInfoBox(false)}
          >
            Session
          </div>
          <div
            // className="info-hoverable"
            // className="btn btn-secondary"
            className={"btn btn-".concat(
              showRoutesInfoBox ? "primary" : "secondary"
            )}
            onMouseEnter={() => setShowRoutesInfoBox(true)}
            onMouseLeave={() => setShowRoutesInfoBox(false)}
          >
            Routes
          </div>
          {/* </div> */}
        </div>

        <div className="stretch-w-100 padded" key="Info boxes from hover">
          {showSessionInfoBox && (
            // <div className="card fixed-hovering ">
            <div className="card stretch-w-70 " style={{ position: "fixed" }}>
              <div className="card-body">
                <h5 className="card-title">Session</h5>
                <p className="card-text ">
                  - SessionId is valid for 1 minute and refreshId for 5 minutes.
                  <br />
                  - Your session expires in 5 minutes if not updated.
                  <br />- Test refreshing the session using button{" "}
                  <b>(Update Session)</b>
                </p>
              </div>
            </div>
          )}
          {showRoutesInfoBox && (
            <div className="card stretch-w-70 " style={{ position: "fixed" }}>
              <div className="card-body">
                <h5 className="card-title">Routes</h5>
                <p className="card-text">
                  - Logged in -status redirects navigation (as Authenticated or
                  a Guest).
                  <br /> - Example: Guest is redirected from /home to /login.
                  <br />- Try setting the url into: <b>/</b>, <b>/login</b>,
                  {"  "}
                  <b>/signup</b>, <b>/home</b>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="submit-container">
          <div className="submit" onClick={logSessionCookies}>
            Log Cookies
          </div>
          <div className="submit" onClick={updateSession}>
            Update session
          </div>
        </div>
        <div className="info-msg">
          <p key="info-msg">{infoMsg}</p>
        </div>
        <div className="submit-container">
          <div className="submit" onClick={() => logOut(false)}>
            Log out
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
