// Generic DB functions

const sqlite3 = require('sqlite3').verbose();


function logMoreErrorInfo(e){
    // https://stackoverflow.com/questions/1901012/javascript-exception-handling-displaying-the-line-number
    try
    {console.log(e.message);
    console.log(e.stack);
    const [, lineno, colno] = e.stack.match(/(\d+):(\d+)/);
    console.log('Line:', lineno);
    console.log('Column:', colno);}
    catch{;}
}

// (Promise) Assure table exists in db
async function assureTable(db,tablename) {
    // Creates table if not exist
    // Returns DB at resolve
    console.log("DbActions - assureTable(" + db + ", " + tablename + ")");

    // Create query
    query = "CREATE TABLE IF NOT EXISTS " + tablename;
    if (tablename == "users"){
        query += `(
            userName text,
            email text, 
            password text,
            userId text
        )`;
    }
    else if (tablename == "sessions"){
        query += `(
            sessionId text,
            sessionExpire text,
            refreshId text,
            refreshExpire text
        )`;
    }

    const dbTableExists = new Promise((resolve,reject) => {
        db.run(query, (err)=>{
            if (!err){
                console.log("-DbActions - assureTable - db.run() ok with DB " + db);
                return resolve(db);
            }
            "-DbActions - assureTable - Error catch: " + err.toString();
            return reject(err)
        });
    });
    // Run query
    return await dbTableExists;

}

// (Promise) Get database (and assure Table exists) 
async function getDb(dbpath, tablename){
    console.log("-DbActions - getDb("+dbpath+", "+tablename+")");

    const connectedDb = () => new Promise(function(resolve,reject){
        let db = new sqlite3.Database(dbpath, (err) => {
            if (err) {
            console.log(`--DB (${tablename}) Error: ` + err.message);
            reject(err.message);
            }
            console.log(`--DB (${tablename}) Connected successfully`);
            resolve(db);
        });
      });

    // return Promise: database or error //
    // NOTE. USE 'return' in callback to keep .then chain going -- .then(()=>{ return a() }) -- 
    // --> 'return' inside .then -callback mean what is returned from .then()
    // --> use separate return for returning the Promise DB from getDb
    let p;
    await connectedDb()
    .then(function(db1) {return assureTable(db1,tablename);}) // returns back the same db in Promise
    .then((db2) => { p = Promise.resolve(db2);}) // db2 is return obj from above if that Promise resolved 
    .catch((e)=> {
        logMoreErrorInfo(e);
        p = Promise.reject(e);
    });
    return p;
}

// (Promise) Make query for rows in db
async function makeQueryAll(db, query, params){
    console.log("--- makeQueryAll(" + db + ", " + query + ", " + params + ")");
    let p = new Promise(function(resolve,reject){
        db.all(query, params, 
            ((err,rows)=>{
                if (err){
                    reject(err);
                } else { 
                     // object format
                    console.log("--- ROWS as object dir:");
                    console.dir(rows);
                    resolve(rows);}
            })
            );
    });
    return p;
}

// (Promise) get Rows as object
async function getRowsFromDb(dbpath, tablename, query, params){
    console.log("-DbActions.cjs - getRowsFromDb("+dbpath+", "+tablename+", "+query+", ["+params+"])");
    let p;
    await getDb(dbpath, tablename)
    .then((newdb) => { 
        console.log(" ---getRowsFromDb got DB?: "+newdb);
        return makeQueryAll(newdb, query, params);
    })
    .then((rows) => {
        console.log(" ---getRowsFromDb got rows?: "+rows);
        p = Promise.resolve(rows);})
    .catch((e) => {p = Promise.reject(e)});
    return p;
}

async function insertToDb(dbpath, tablename, insertQuery, values){
    console.log("-DbActions.cjs - insertToDb("+dbpath+", "+tablename+", "+insertQuery+", "+values+")");
    await getDb(dbpath, tablename)
    .then((newdb) => { 
        console.log(" ---insertToDb got DB?: "+newdb);
        try{
            newdb.run(insertQuery, values,function(err) {
                if (err) {
                    console.log("DbActions.insertToDb error:" + err.message);
                    return Promise.reject(err);}
                return Promise.resolve("ok");} );
        }
        catch(e){return Promise.reject(e);}
    })
    .catch((e) => {return Promise.reject(e)});
}


module.exports = {
    getRowsFromDb : getRowsFromDb,
    getDb: getDb,
    insertToDb: insertToDb,
}