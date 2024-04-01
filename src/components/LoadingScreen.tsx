const LoadingScreen = () => {
  const loadingScreenStyles = {
    display: "flex",
    //flexDirection: "column",
    alignItems: "center",

    margin: "auto",
    marginTop: "1rem",
    width: "60%",
    height: "60%",
    maxWidth: "600px",
    background: "white",
    borderRadius: "16px",
    paddingTop: "30px",
    paddingBottom: "30px",

    // borderStyle: "solid",
    // borderColor: "red",
  };
  return (
    <>
      <div className="container" style={loadingScreenStyles}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </>
  );
};
export default LoadingScreen;
