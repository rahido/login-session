// Receiving & reading POST request (json)
// https://stackoverflow.com/questions/12006417/node-js-server-that-accepts-post-requests#12007627

const authenticationControl = require('./AuthenticationControl.cjs');
const sessionControl = require('./SessionControl.cjs');

// import any login dataobjects /vars
// loginDO --> no use importing it for the type ref, as type would be <Promise>
// let loginDataObject;
// async function loadLoginDO() {
//   await import('./AuthenticationVars.mjs')
//   .then((authVars)=>{
//     console.log("ServerListen - Importing loginDataObject");
//     loginDataObject = authVars.loginDataObject;
//     return resolve();
//   }).catch((e) => {
//     console.log("ServerListen - Import Error for loginDataObject: " + e);
//     loginDataObject = {};
//     return reject();
//   });
// }
// loadLoginDO().catch((e)=>{});


var http = require('http');
//import http from 'node:http';

const port = 8080;
// http.createServer(function (req, res) {
// const headers = {
//     'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
//     'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
//     'Access-Control-Max-Age': 2592000, // 30 days
//     /** add other headers as per requirement */
//     'Content-Type': 'json'
//     };

//   res.writeHead(200, headers);

//   let response = solveReq(req);
//   res.write(response);
//   res.end();
// }).listen(port);

const headers = {
  'Access-Control-Allow-Origin': '*', /* @dev First, should read more about security */
  'Access-Control-Allow-Headers': '*', /* @dev First, should read more about security */
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  'Access-Control-Max-Age': 2592000, // 30 days
  /** add other headers as per requirement */
  'Content-Type': 'application/json'
  };

// Create a local server to receive data from
const server = http.createServer();

// Listen to the request event
server.on('request', (request, res) => {
  // https://www.w3schools.com/nodejs/obj_http_incomingmessage.asp
  console.log("\nurl: " + request.url);
  let requestUrl = request.url;
  // handle the request.body concatenation
  if (request.method == "POST") {
    console.log('POST');
    var body = '';
    // Concate data
    request.on('data', function(data) {
      body += data;
      //console.log('Partial body: ' + body);
    })
    // Received fully
    request.on('end', async function() {
      console.log('Body: ' + body);

      // Solve login /sign up
      // let responseStr : json stringified ( {requested data} | {err:""} )
      let responseStr = "";
      await solveRequest(requestUrl, body)
      .then((responseData) => { 
        // Expecting return of types:
        // login user --> returns { typeof loginDataObject }
        // insert new user --> returns {msg : "New account created"}
        // session check --> returns {typeof sessionCheckObject}
        responseStr = JSON.stringify(responseData);
        console.log("ServerListen - request:" + requestUrl + " --Responded OK. (str): " + responseStr);
        console.dir(responseData);
      })
      .catch((e) => {
        // Error at solveRequest --> returns {err:e}
        console.log("ServerListen - request:" + requestUrl +" -Catched ERR. " + e);
        let errMsg = e? e.toString() : `Error: Unknown rejection (${requestUrl})`;
        errData = {err:errMsg}
        responseStr = JSON.stringify(errData);
      });

      console.log("ServerListen - request:" + requestUrl + " -> Send back data: " + responseStr);

      res.writeHead(200,headers); // 200 ok
      res.end(responseStr);
    })
  }
  // If not POST
  else{
    res.writeHead(200,headers);
    res.end(JSON.stringify({data: 'Server - received GET msg',}));
  }
});

server.listen(port);

async function solveRequest(requestUrl, body){
  // Should return a json object in resolve, or error in reject
  let responseData = {};

  console.log("ServerListen - solveRequest - " + requestUrl);
  

  // LOGIN
  if (requestUrl == "/login"){
    let contents = JSON.parse(body);
    
    // if resolved
    // returns {typeof loginDataObject} 
    let loginDO = {};

    // If rejected
    let p1 = await authenticationControl.getUserData(username="",email=contents.email,password=contents.password,userid="");
    let p2 = await sessionControl.makeSessionIds();
    return Promise.all([p1,p2])
    .then(([userData,sessionData])=>{
      console.log("ServerListen - solveRequest (" + requestUrl + ") - requested 2 Promises resolved: ");
      console.log("--- " + JSON.stringify(userData));
      console.log("--- " + JSON.stringify(sessionData));

      console.dir(loginDO);
      loginDO.userId = userData.userId; // users db row with matching userId
      loginDO.sessionIds = sessionData; // new session ids, expire dates

      // responseData.userData = userData.data; // users db row with matching userId
      // responseData.sessionIds = sessionData; // new session ids, expire dates
      console.dir(loginDO);
      return Promise.resolve(loginDO);
    })
    .catch((e)=>{ 
      // Error could be:
      // 1) DB Error (inside DbActions.getRowsFromDb)
      // 2) "Username or Password incorrect" (matching row not found inside DbActions.getRowsFromDb)
      console.log("ServerListen - solveRequest - login rejected: " + e);
      return Promise.reject(e.toString())});
  }
  // SIGN UP
  else if (requestUrl == "/signup") {
    let contents = JSON.parse(body);
    // if resolved
    // returns {msg:"New account created"}
    // If rejected
    // Error in database related insert. returns error as string
    return await authenticationControl.insertUserData(contents.username, contents.email, contents.password)
    .then((data) => {
      // returns {msg:"New account created"}
      return Promise.resolve(data);})
    .catch((err) => {
      // returns DB- or DB-insert error as string
      return Promise.reject(err.toString());});
  }
  // CHECK /UPDATE SESSION ID
  else if (requestUrl == "/sessioncheck"){
    let contents = JSON.parse(body);
    
    console.log("ServerListen -- Before checkSessionIds concluded");
    // if resolved
    // returns {typeof sessionCheckObject}
    // ...sessionCheckObject = {sessionids : {}, msg: "", updated:false}
    // If rejected
    // returns Error (string) from database related search.
    return await sessionControl.checkSessionIds(sessionId=contents.sessionId,refreshId=contents.refreshId)
    .then((sessionData) =>{ 
      console.log("ServerListen -- After checkSessionIds concluded. OK. here's dir:");
      console.dir(sessionData);
      return Promise.resolve(sessionData);
    })
    .catch((rejectionErr) => {
      console.log("ServerListen -- After checkSessionIds concluded. Error: " + rejectionErr);
      return Promise.reject(rejectionErr)
    });
  }
  // Return reject if not returned yet
  return Promise.reject("solveRequest Error. Possibly false url");
}