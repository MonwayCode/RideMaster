const mysql = require('mysql');

const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "ridemaster" 
})

db.connect((err) => {
    if (err) {
        console.error("Błąd połączenia z bazą danych:", err);
        throw err;
    }
    console.log("Połączono z bazą danych.");
});

module.exports = db;