const db = require("../config/database");
const multer = require("multer");
const path = require("path");
const fs = require('fs');

// Konfiguracja Multer do przesyłania plików
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder docelowy dla przesłanych plików
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unikalna nazwa pliku
  },
});

const upload = multer({ storage }).single("image");

// Funkcja kontrolera do dodawania wydarzeń
exports.addEvent = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: "Błąd przy przesyłaniu pliku" });
    }

    const { title, shortDescription, longDescription, stableId } = req.body;
    const imageUrl = req.file.filename;

    const sql = `INSERT INTO events (title, shortDescription, longDescription, imageUrl, stableId) VALUES (?, ?, ?, ?, ?)`;
    const values = [title, shortDescription, longDescription, imageUrl, stableId];

    db.query(sql, values, (error, result) => {
      if (error) 
      {
        console.error("Błąd przy zapisie do bazy danych:", error);
        return res.status(500).json({ error: "Błąd przy dodawaniu wydarzenia" });
      }
      res.status(200).json;
    });
  });
};



exports.getEvent = (req, res) => {
    const { stableId } = req.params;
    const sql = `SELECT * FROM events WHERE stableId = ?`;
    db.query(sql, [stableId], (err, results) => {
        if (err) 
        {
            console.error("Błąd przy pobieraniu wydarzenia: ", err);
        } 
        else 
        {
            res.json(results);
        }
    });
};


exports.deleteEvent = (req, res) => {
  const { id } = req.params;  
  const sql = `SELECT imageUrl FROM events WHERE id = ?`;  // Pobieranie nazwy obrazka by go usunąć z folderu

  // Zapytanie o nazwę pliku z bazy
  db.query(sql, [id], (err, results) => {
    if (err) 
    {
      throw err;
    }

    const imageUrl = results[0].imageUrl;  // Pobranie nazwy pliku
    const filePath = path.join(__dirname, "../uploads", imageUrl);  // Ścieżka do pliku w folderze uploads

    // Usunięcie obrazka z folderu
    fs.unlink(filePath, (error) => {
      if (error) 
      {
        console.error("Błąd przy usuwaniu obrazka:", error);
      }

      // Usuwanie samego wydarzenia z bazy danych
      const deleteSql = `DELETE FROM events WHERE id = ?`;
      db.query(deleteSql, [id], (err, result) => {
        if (deleteErr) 
        {
          console.error("Błąd przy usuwaniu wydarzenia z bazy danych:", err);
        }
      });
    });
  });
};