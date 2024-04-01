// import { sessionCheckObject } from './SessionVars.mjs';

const sqlite3 = require('sqlite3').verbose();

const DbActions = require('./DbActions.cjs');


let sessionCheckObject;
let SESSIONSDBPATH;
let SESSIONSTABLE;
// Dynamic import for vars (.mjs to .cjs)
async function loadSessionVars() {
    await import('./SessionVars.mjs')
    .then((v) => {
        console.log("import sessionVars");
        sessionCheckObject = v.sessionCheckObject;
        SESSIONSDBPATH = v.sessionsDbPath;
        SESSIONSTABLE = v.sessionsDbTable;

        return Promise.resolve(v);})
    .catch(console.log("import error (sessionVars)"));
}
loadSessionVars()



// Save new session ids to DB
async function insertSessionToDb(session){
    console.log("SessionControl - insertSessionToDb");

    let insertQuery = "INSERT INTO "+SESSIONSTABLE+"(sessionId, sessionExpire, refreshId, refreshExpire) VALUES(?, ?, ?, ?)";
    let values = [session.sessionId, session.sessionExpire, session.refreshId, session.refreshExpire];

    return await DbActions.insertToDb(SESSIONSDBPATH, SESSIONSTABLE, insertQuery, values);
    
}

async function makeSessionIds(){
    console.log("SessionControl - makeSessionIds");
    const d = new Date();
    const sessionDuration = 60 * 1000; // ms // Session expires after (1min)
    const refreshDuration = 5 * 60 * 1000; // ms // Refresh expires after (5min)
    let sessionExpire = new Date( d.getTime() + sessionDuration ).toUTCString();
    let refreshExpire = new Date( d.getTime() + refreshDuration ).toUTCString();

    let sessionId = "session-" + (Math.floor(Math.random() * Date.now()).toString(16));
    let refreshId = "refresh-" + (Math.floor(Math.random() * Date.now()).toString(16));

    // Session data as object
    let newSessionIds = {sessionId:sessionId, sessionExpire:sessionExpire, refreshId:refreshId, refreshExpire:refreshExpire};


    return await insertSessionToDb(newSessionIds)
    .then((ok) => {return Promise.resolve(newSessionIds);})
    .catch((e) => {return Promise.reject(e);});
}


async function checkSessionIds(sessionId,refreshId){
    console.log("SessionControl - checkSessionIds("+sessionId+", "+refreshId+")")
    // Returns {sessionCheckObject}
    // Returns {sessionIds : rowData, updated:false, msg:""}
    return new Promise(function(resolve,reject){
        // Deep copy object template. Return it with new values
        // let sessionData = JSON.parse(JSON.stringify(sessionCheckObject));
        // let sessionData = {...sessionCheckObject};
        let sessionData = structuredClone(sessionCheckObject);
        getSessionRows(sessionId,refreshId)
        .catch(e => {
            // e : string
            console.log("SessionControl - checkSessionIds - resolve with - no row found: " + e);
            // Send back empty sessionCheckObject and err
            return reject(e);
        })
        .then(
            // Success getting session data row
            (rowsData) => {
                console.log("SessionControl - checkSessionIds : got row data")
                
                // if session is still valid (not expired) - will return {typeof sessionCheckObject}
                // Data object to return (typeof sessionCheckObject)
                sessionData.sessionIds = rowsData;

                var dateSess = new Date(sessionData.sessionIds.sessionExpire);
                var dateRefr = new Date(sessionData.sessionIds.refreshExpire);

                let d = new Date().toUTCString();
                let dateNow = new Date(d); // UTC date now

                // if session is expired
                // set .updated = true
                if(dateSess.getTime() < dateNow.getTime()){
                    console.log("-Session is expired - checking for refresher date...");
                    sessionData.updated = true;
                    
                    // if Refresher id ok. 
                    // --> Make new session ids, insert to DB, return to user
                    if(dateRefr.getTime() > dateNow.getTime()) {
                        console.log("-Refresher id ok. Make new session ids and send to user");
                        return makeSessionIds()
                        .then(
                            (newIds)=>{
                                // return new session ids
                                sessionData.sessionIds = newIds
                                sessionData.msg = "Session Refreshed";
                                console.log("--- new session ids made, resolving");
                                return resolve(sessionData);
                            },
                            (idsErr)=>{
                                // Error at creating /inserting new ids to DB
                                return reject(idsErr);
                            }
                        );
                    } else {
                        // if session ids are expired (both sessionId and refreshId)
                        // NOTE. this should not run. Empty ids (//expired cookies) shouldn't pass through ClientSession.js
                        return reject("Session expired");
                    }
                } 
                else{
                    // Session is not expired. Return ids unchanged, add msg
                    console.log("-Session is not expired - return non-updated id values");
                    sessionData.msg = "Session is still valid";
                    return resolve(sessionData);
                }
            },
            // Error getting session data row
            (rowsErr) => { 
                console.log("-Error getting session data row: " + rowsErr);
                return reject(rowsErr); 
            }
        )
        .catch((e) => { 
            // Error inside .then, after rows gotten
            console.log("-Error inside .then, after rows gotten: " + rowsErr);
            return reject(e); 
        });
    });
}

async function getSessionRows(sessionId,refreshId){

    console.log("SessionControl - getSessionRows("+sessionId+", "+refreshId+")")
    
    return new Promise(function(resolve,reject){

        let query = "sessionId=?";
        query = "SELECT * FROM " + SESSIONSTABLE + " WHERE sessionId=? OR refreshId=?";
        let params = [sessionId,refreshId];
        //params.push(sessionId);
        rows = DbActions.getRowsFromDb(SESSIONSDBPATH,SESSIONSTABLE, query, params);
        rows.then(
            (rowsData) => {
                console.log("SessionControl.cjs - getSessionRows - rowsData ok");
                
                console.log("rowsData.length: " + rowsData.length);
                if (rowsData.length===0){
                    // No row - reject
                    return reject("Session Ids Row not found in DB");
                }else {
                    // Got row - resolve 1st row match
                    return resolve(rowsData[0]);
                }
            },
            (rowsError) => {
                console.log("SessionControl.cjs - getSessionRows - reading rows ERROR");
                reject(rowsError.toString());
            });
    })
}

module.exports = {
    makeSessionIds: makeSessionIds,
    checkSessionIds: checkSessionIds,
    sessionCheckObject: sessionCheckObject,
};