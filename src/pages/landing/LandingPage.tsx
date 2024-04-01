import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen";
import "../defaultStyles/defaultStyles.css";

const LandingPage = () => {
  const navigate = useNavigate();

  function goToHomePage() {
    navigate("/home");
  }
  return (
    <div className="fixed-bg">
      <>a</>
      <div className="container">
        <div className="header">
          <div className="text">Landing Page</div>
          <div className="underline"></div>
        </div>

        <div className="submit-container">
          <div className="submit" onClick={goToHomePage}>
            Home
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
