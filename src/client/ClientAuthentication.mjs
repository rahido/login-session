// Sending a POST request (json)
// https://stackoverflow.com/questions/29775797/fetch-post-json-data/42493030#42493030

// // import with `import`
// import fs from "fs";

// // export with `export`
// export function loadData(filename) {
//     const content = fs.readFileSync(filename);
//     return content.toString();
// }

// export const loginDataObject = {
//   userData: {
//     username: "",
//     email: "",
//     password: "",
//     userid: "",
//   },
//   sessionIds: {
//     sessionId: "",
//     sessionExpire: "",
//     refreshId: "",
//     refreshExpire: "",
//   },
// };

let baseUrl = "http://127.0.0.1:8080";

let loginHeaders = new Headers({
    "Content-Type": "application/json",
  });


const validateEmailRegex = (email) => {
    // REGEX simple input validation for email
    // https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
    // [^\s@] means "neither a whitespace character nor @". [xyz] means any one of x, y or z, and [^xyz] means any one character except x, y or z. \s means "any whitespace character". \S means "any character that is not whitespace"
    // var re = /^\S+@\S+\.\S+$/;
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log("ClientAuthentication.js - validateEmailRegex - return " + re.test(email).toString());
    return re.test(email);
};


export async function loginUser(email, password) {
    //let response = await fetch(loginReq)
    // console.log(response.status); // 200
    // console.log(response.statusText); // OK

    // if (response.status === 200) {
    //     let data = await response.text();
    //     // handle data
    // }

    console.log("Click -> loginUser");

    // Return if invalid login input
    if (email.trim() == "" || !validateEmailRegex(email)){
        return Promise.reject("Invalid email type");
    } 
    if (password.trim() == ""){
        return Promise.reject("Password needed");
    }
    
    let loginOpts = {
        method: 'POST',
        headers: loginHeaders,
        body: JSON.stringify({email: (email), password: (password)})
    }
    let reqUrl = baseUrl + "/login"
    // https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#syntax
    // https://developer.mozilla.org/en-US/docs/Web/API/Request
    let loginReq = new Request(reqUrl, loginOpts);

    // AWAIT promise
    // https://stackoverflow.com/questions/45348955/using-await-within-a-promise

    // https://developer.mozilla.org/en-US/docs/Web/API/fetch#syntax
    // Send POST --> will be solved in ServerListen.cjs -> solveRequest()
    console.log("ClientAuthentication.js - start fetch() : " + reqUrl);
    let p;
    

    return await fetch(loginReq)
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
            console.log("ClientAuthentication - login - fetch status code: " + response.status);
            throw new Error(response);
        }
        // to json
        return response.json()
    })
    .then((responseJson)=>{
        console.log("STRINGIED: " + JSON.stringify(responseJson));
        console.dir(responseJson);
        if(responseJson.err){
            // .err could be:
            // 1) DB Error as string (from DbActions.getRowsFromDb)
            // 2) "Username or Password incorrect" (matching row not found from DbActions.getRowsFromDb)
            return Promise.reject(responseJson.err);
        }
        return Promise.resolve(responseJson);
    })
    .catch((e) => {
        console.log("ClientAuthentication.js - caught Error: " + e); 
        console.dir(e);
        return Promise.reject(e);
    });
}

export async function signUpUser(username, email, password) {
    console.log("Click -> signUpUser");

    // Return if invalid input for sign up
    if (username.trim() == ""){
        return Promise.reject("Username needed");
    }
    if (email.trim() == "" || !validateEmailRegex(email)){
        return Promise.reject("Invalid email type");
    } 
    if (password.trim() == ""){
        return Promise.reject("Password needed");
    }
    
    // Fetch Request options
    // https://developer.mozilla.org/en-US/docs/Web/API/fetch#syntax
    let loginOpts = {
        method: 'POST',
        headers: loginHeaders,
        body: JSON.stringify({username: (username), email: (email), password: (password)})
    }
    let reqUrl = baseUrl + "/signup"
    let signupReq = new Request(reqUrl, loginOpts);

    // Receives {msg:""} or (error)
    return await fetch(signupReq)
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
    .then((responseJson)=>{
        console.log("STRINGIED: " + JSON.stringify(responseJson));
        console.dir(responseJson);
        return Promise.resolve(responseJson);
    })
    .catch((e) => {return Promise.reject(e.toString())});
}

