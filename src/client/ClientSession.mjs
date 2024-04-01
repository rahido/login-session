

export async function makeSessionCheck(sessionId,refreshId) {
  
  // Check params validity. Empty strings would mean expired sessionIds from cookies
  if (sessionId==="" && refreshId===""){
    // deep copy of session data object template
    // // let d = JSON.parse(JSON.stringify(sessionCheckObject));
    // let d = structuredClone(sessionCheckObject);
    // d.msg = "Session expired";
    // data = {data: sessionCheckObject}
    // let returnData = {data:d};
    console.log("ClientSession.cjs - makeSessionCheck - Session is Expired");
    return Promise.reject("Session Expired");
    // return Promise.resolve(returnData);
  }


  let baseUrl = "http://127.0.0.1:8080";

  let headers = new Headers({
      "Content-Type": "application/json",
    });
  
  let loginOpts = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({sessionId: (sessionId), refreshId: (refreshId)})
  }
  let reqUrl = baseUrl + "/sessioncheck"
  // https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#syntax
  // https://developer.mozilla.org/en-US/docs/Web/API/Request
  let req = new Request(reqUrl, loginOpts);
  
  console.log("ClientSession.cjs - makeSessionCheck - start fetch() : " + reqUrl);
  return await fetch(req)
  .catch((e => {
      // net::ERR_CONNECTION_REFUSED
      // Server is down.
      let serverdownMsg = "Server is not answering - " + e;
      return Promise.reject(serverdownMsg);
  }))
  .then((response) => {
      if (!response.ok){
          // Could check status code here. ServerListen.cjs for now returns always 200 (ok).
          // (Possible DB error messages comes inside the response jsn as {err:""})
          console.log("ClientAuthentication - Signup - fetch status code: " + response.status);
          throw new Error(response);
      }
      // to json
      return response.json()
  })
  .then((data) => {
      // data = {typeof sessionCheckObject} | {err:string}
      console.log("ClientSession.cjs - makeSessionCheck - after fetch() : " + reqUrl);
      if(data.err){
        return Promise.reject(data.err.toString());
      }
      console.log("ClientSession.cjs - makeSessionCheck - got dir");
      console.dir(data);
      return Promise.resolve(data);
  })
  // catch error caused by: response.json()
  .catch((error) => {return Promise.reject(error.toString());});
}