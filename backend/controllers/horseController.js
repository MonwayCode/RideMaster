const db = require("../config/database");

exports.addHorse = (req, res) => {
  const { name, stableId } = req.body;

  // Zapytanie SQL do dodania konia
  const query = 'INSERT INTO horses (name, stableId) VALUES (?, ?)';
  db.query(query, [name, stableId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Wystąpił błąd podczas dodawania konia." });
    }

    // Odpowiedź po pomyślnym dodaniu
    return res.status(200).json({ message: "Koń został dodany pomyślnie!" });
  });
};

exports.removeHorse = (req, res) => {
  const { horseId } = req.params;

  // Zapytanie SQL do usunięcia konia
  const query = 'DELETE FROM horses WHERE horseId = ?';
  db.query(query, [horseId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Wystąpił błąd podczas usuwania konia." });
    }

    return res.status(200).json({ message: "Koń został usunięty." });
  });
};

exports.getHorse = (req, res) => {
  const { stableId } = req.params;

  // Zapytanie SQL do pobrania wszystkich koni w danej stajni
  const query = 'SELECT * FROM horses WHERE stableId = ?';
  db.query(query, [stableId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Wystąpił błąd podczas pobierania koni." });
    }

    // Zwracamy listę koni
    return res.status(200).json(result);
  });
};
