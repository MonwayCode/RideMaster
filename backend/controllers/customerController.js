const db = require('../config/database');

exports.addCustomer = (req, res) => {
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
        res.status(200).json();
    });
};

exports.listOfStables = (req, res) => {
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
};

exports.listOfParticipants = (req, res) => {
    const stableId = req.params.stableId;

    const sql = `
        SELECT u.userId, u.name, u.surname, u.email, u.phone, c.role
        FROM customers c
        JOIN users u ON c.userId = u.userId
        WHERE c.stableId = ?
        `;

        db.query(sql, [stableId], (err, results) => {
            if(err)
            {
                throw err;
            }
            else
            {
                res.json(results);
            }
        })
};

exports.roleUpdate = (req,res) => {
    const userId = req.params.userId;
    const { role } = req.body;
    
    const sql = `UPDATE customers SET role = ? WHERE userId = ?`;

    db.query(sql, [role, userId], (err, results) => {
        if(err)
        {
            throw err;
        }
        else
        {
            res.status(200).json({ message: "Rola użytkownika została zaktualizowana" });   
        }
    })
};

exports.deleteCustomer = (req,res) => {
    const userId = req.params.userId;

    const sql = `DELETE FROM customers WHERE userId = ?`;
    db.query(sql, [userId], (err, results) => {
        if(err)
            {
                throw err;
            }
        else
            {
                res.status(200).json({ message: "Użytkownik usunięty" }); 
            }
        })
};

