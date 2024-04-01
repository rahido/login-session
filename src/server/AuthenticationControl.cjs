
// const sqlite3 = require('sqlite3').verbose();

const DbActions = require('./DbActions.cjs');

// const USERSDBPATH = './users.db';
// const USERSTABLE = 'users';

// let loginDataObject;
let USERSDBPATH;
let USERSTABLE;
// Dynamic import for vars (.mjs to .cjs)
async function loadAuthVars() {
    await import('./AuthenticationVars.mjs')
    .then((authVars) => {
        console.log("AuthControl - import authVars");
        USERSDBPATH = authVars.usersDbPath;
        USERSTABLE = authVars.usersTable;
        //loginDataObject = authVars.loginDataObject;
        return Promise.resolve(authVars);})
    .catch((e) => {console.log("AuthControl - import error (authVars)");})
}
loadAuthVars();

// Get User data (using one or more of params). Returns string row when only one match found.
async function getUserData (username, email, password, userid) {
    console.log("-AuthControl - getUserData");
    let userDataObject = {userName:"", email:"", password:"", userId:""};

    // Query string for DB
    let query = "";
    params = []
    if (username){
        query = "userName=?";
        params.push(username);}
    if (email){
        query = query.length==0? "email=?" : query + " AND email=?";
        params.push(email);}
    if (password){
        query = query.length==0? "password=?" : query + " AND password=?";
        params.push(password);}
    if (userid){
        query = query.length==0? "userId=?" : query + " AND userId=?";
        params.push(userid);}
    query = "SELECT * FROM users WHERE " + query;

    // Matching rows from database
    return await DbActions.getRowsFromDb(USERSDBPATH,USERSTABLE, query, params)
    .then((rows) => {
        console.log("-AuthControl - getUserData - check gotten rows and return");

        // Check if response is one row 
        if (rows.length === 0){
            console.log("-AuthControl - getUserData - rows.length === 0 -> Username or Password incorrect");
            return Promise.reject("Username or Password incorrect");
        }
        else{
            console.log("-AuthControl - getUserData - rows as dir. Return resolve(rows[0])");
            console.dir(rows);
            userDataObject = rows[0];
            return Promise.resolve(userDataObject);
        }
    })
    .catch((e)=>{return Promise.reject(e);});
}

// Sign up - new user to DB. A unique userid is generated here.
async function insertUserData(username, email, password){
    console.log("AuthControl - insertUserData");

    let newId = Math.floor(Math.random() * Date.now()).toString(16);
    let insertQuery = "INSERT INTO "+USERSTABLE+"(userName, email, password, userId) VALUES(?, ?, ?, ?)";
    let values = [username, email, password, newId];

    return await DbActions.insertToDb(USERSDBPATH, USERSTABLE, insertQuery, values)
    .then((ok) => {return Promise.resolve({msg:"New account created"});})
    .catch((e) => {return Promise.reject(e);});
}


module.exports =  {
    getUserData: getUserData,
    insertUserData: insertUserData,
  };