const db = require("../config/database");


exports.newTraining = (req, res) => {
  const { clientId, trainerId, date, timeStart, timeEnd, horseId, trainingType, comment, status, stableId } = req.body;

  const query = `INSERT INTO lessons (clientId, trainerId, date, timeStart, timeEnd, horseId, trainingType, comment, status, stableId) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.query(
    query,
    [clientId, trainerId, date, timeStart, timeEnd, horseId, trainingType, comment, status, stableId], 
    (err, result) => {
      if (err) {
        console.error("Błąd podczas dodawania treningu: ", err);
        return res.status(500).json({ message: "Błąd podczas dodawania treningu" });
      }
      return res.status(201).json;
    }
  );
};

exports.getTrainings = (req, res) => {
  const stableId = req.params.stableId;
  const query = `SELECT * FROM lessons 
                 WHERE stableId = ? 
                 ORDER BY date, timeStart`;

  db.query(query,[stableId], (err, result) => {
    if (err) {
      console.error("Błąd podczas pobierania treningów: ", err);
      return res.status(500).json({ message: "Błąd podczas pobierania treningów" });
    }
    return res.status(200).json(result);
  });
};

exports.updateTraining = (req, res) => {
  const { lessonId } = req.params;
  const { clientId, trainerId, date, timeStart, timeEnd, horseId, trainingType, comment, status, stableId } = req.body;

  const query = `UPDATE lessons 
                 SET clientId = ?, trainerId = ?, date = ?, timeStart = ?, timeEnd = ?, horseId = ?, trainingType = ?, comment = ?, status = ?, stableId = ? 
                 WHERE lessonId = ?`;

  db.query(query,[clientId, trainerId, date, timeStart, timeEnd, horseId, trainingType, comment, status, stableId, lessonId],(err, result) => {
      if (err) {
        console.error("Błąd podczas aktualizacji treningu: ", err);
        return res.status(500).json({ message: "Błąd podczas aktualizacji treningu" });
      }
      return res.status(200).json({ message: "Trening został zaktualizowany" });
    }
  );
};


exports.removeTraining = (req, res) => {
  const { lessonId } = req.params;

  const query = `DELETE FROM lessons WHERE lessonId = ?`;

  db.query(query, [lessonId], (err, result) => {
    if (err) {
      console.error("Błąd podczas usuwania treningu: ", err);
      return res.status(500).json({ message: "Błąd podczas usuwania treningu" });
    }
    return res.status(200).json({ message: "Trening został usunięty" });
  });
};
