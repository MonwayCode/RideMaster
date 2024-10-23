const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

//łączenie się z bazą danych w phpmyadmin
const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "ridemaster" 
})

app.post('/rejestracja', (req,res) => {
    const sql =  `INSERT INTO users (name, surname, email, phone, password) VALUES (?, ?, ?, ?, ?)`;
    const values = [req.body.name, req.body.surname, req.body.email, req.body.phone, req.body.password];
    db.query(sql,values, (err,data) => {
        if(err)
        {
            throw err;
        }
        return res.json(data);
    }) 
})

app.post('/logowanie', (req,res) => {
    const sql = "SELECT * FROM users WHERE `email` = ? AND `password` = ?";
    db.query(sql,[ req.body.email, req.body.password], (err,data) => {
        if(err)
        {
            throw err;
        }
        if(data.length > 0)
        {
            return res.json({userId:data[0].userId, error:null})
        }
        else
        {
            return res.json({userId:null, error:"Blad! Nie znaleziono uzytkownika"})
        }
    })
})

app.get('/imie/:userId', (req, res) => {
    const x = req.params.userId;
    const sql = `SELECT name FROM users WHERE userId = ?`;
    db.query(sql,[x], (err, results) => {
        if (err) {
            throw err;
        }
        const userName = results[0].name;
        return res.json({ name: userName });    });
});

app.post('/nowastajnia', (req, res) => {
    const sql = `INSERT INTO stables (name, location, ownerId) VALUES (?, ?, ?)`;
    const values = [req.body.name, req.body.location, req.body.ownerId];

    db.query(sql, values, (err, data) => {
        if (err) 
        {
            throw err;
        }

        const stableId = data.insertId;

        const sqlOwner = `INSERT INTO customers (userId, stableId, role) VALUES (?, ?, 'owner')`;
        const customerValues = [req.body.ownerId, stableId];

        db.query(sqlOwner, customerValues, (err, ownerResults) => {
            if (err) 
            {
                throw err;
            }
        });
    });
});


app.get('/stajnie',(req, res) => {
    const sql = `SELECT * FROM stables`;
    db.query(sql, (err, results) => {
        if(err)
            {
                throw err;
            }
        return res.json(results);
    })
})

app.post('/klienci', (req, res) => {
    const { userId, stableId } = req.body;

    const sql = `INSERT INTO customers (userId, stableId) VALUES (?, ?)`;
    const values = [userId, stableId];

    db.query(sql, values, (err, result) => {
        if (err) {
            
            if (err.code === 'ER_DUP_ENTRY') //obsługa błędu jeśli użytkownik już jest w stajni
            {
                return res.status(400).json();
            }
            else
            {
                throw err;
            }
        }
    });
});

app.get('/list/:userId', (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT s.stableId, c.role, s.name, s.location
        FROM customers c
        JOIN stables s ON c.stableId = s.stableId
        WHERE c.userId = ?
        `;

        db.query(sql, [userId], (err, results) => {
            if(err)
            {
                throw err;
            }
            else
            {
                res.json(results);
            }
        })
})

app.listen(3001, () => {
    console.log(`Server is running on http://localhost:3001`);
});
