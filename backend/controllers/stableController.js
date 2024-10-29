const db = require('../config/database');

exports.addStable = (req, res) => {
    const sql = `INSERT INTO stables (name, location, ownerId) VALUES (?, ?, ?)`;
    const values = [req.body.name, req.body.location, req.body.ownerId];

    db.query(sql, values, (err, data) => {
        if (err) {
            // Obsługuje błąd, jeśli stajnia o tej samej nazwie i lokalizacji już istnieje
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Stajnia o tej nazwie i lokalizacji już istnieje.' });
            }
            // W przypadku innych błędów logujemy i zwracamy odpowiednią informację
            console.error("Błąd podczas dodawania stajni:", err);
            return res.status(500).json({ message: 'Wystąpił błąd podczas dodawania stajni.' });
        }

        const stableId = data.insertId;

        // Dodanie właściciela do bazy danych
        const sqlOwner = `INSERT INTO customers (userId, stableId, role) VALUES (?, ?, 'owner')`;
        const customerValues = [req.body.ownerId, stableId];

        db.query(sqlOwner, customerValues, (err, ownerResults) => {
            if (err) 
            {
                throw err;
            }
            res.status(200).json();
        });
    });
};



exports.getStables = (req, res) => {
    const sql = `SELECT * FROM stables`;
    db.query(sql, (err, results) => {
        if(err)
            {
                throw err;
            }
        return res.json(results);
    })
};
