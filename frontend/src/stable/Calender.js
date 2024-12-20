import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { useParams } from "react-router-dom";

function ClientCalendar() {
  const { stableId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [trainings, setTrainings] = useState([]);
  const [selectedTrainings, setSelectedTrainings] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [horses, setHorses] = useState([]);
  const userId = window.localStorage.getItem("userId");

  // Pobieranie treningów
  const fetchTrainings = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/trainings/${stableId}`);
      const userTrainings = response.data.filter(training => training.clientId === Number(userId));
      setTrainings(userTrainings);
    } catch (error) {
      console.error("Błąd przy pobieraniu treningów:", error);
    }
  };

  // Pobieranie trenerów
  const fetchTrainers = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/customers/trainers/${stableId}`);
      setTrainers(response.data);
    } catch (error) {
      console.error("Błąd przy pobieraniu trenerów:", error);
    }
  };

  // Pobieranie koni
  const fetchHorses = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/horses/${stableId}`);
      setHorses(response.data);
    } catch (error) {
      console.error("Błąd przy pobieraniu koni:", error);
    }
  };

  useEffect(() => {
    fetchTrainings();
    fetchTrainers();
    fetchHorses();
  }, [userId, stableId]);

  // Funkcja do zaznaczania dni treningów z kolorowymi kropkami
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateStr = date.toLocaleDateString("pl-PL");
      const trainingsOnDate = trainings.filter(training => {
        const trainingDate = new Date(training.date);
        return trainingDate.toLocaleDateString("pl-PL") === dateStr;
      });

      if (trainingsOnDate.length > 0) {
        return "has-trainings";
      }
    }
  };

  // Funkcja do wyświetlania kropki na kalendarzu w zależności od typu treningu
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateStr = date.toLocaleDateString("pl-PL");
      const trainingsOnDate = trainings.filter(training => {
        const trainingDate = new Date(training.date);
        return trainingDate.toLocaleDateString("pl-PL") === dateStr;
      });

      return (
        trainingsOnDate.length > 0 &&
        trainingsOnDate.map((training, index) => {
          const color = getTrainingColor(training.trainingType);
          return (
            <div
              key={index}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: color,
                margin: "0 auto",
              }}
            ></div>
          );
        })
      );
    }
  };

  // Funkcja do przypisywania koloru w zależności od typu treningu
  const getTrainingColor = (trainingType) => {
    switch (trainingType) {
      case "indywidualna":
        return "#7D7F7D"; // Czerwony
      case "grupowa":
        return "#0A0A0A"; 
      case "ujeżdżeniowa":
        return "#CBD0CC"; 
      case "skokowa":
        return "#2271B3"; 
      case "hipoterapia":
        return "#00BB2D"; 
      case "lonża":
        return "#59351F"; 
      case "oprowadzanka":
        return "#89AC76";
      default:
        return "#cccccc";   
    }
  };

  // Funkcja do obsługi zmiany daty i filtrowania treningów na wybrany dzień
  const handleDateChange = (date) => {
    setSelectedDate(date);

    const selectedTrainings = trainings.filter(training => {
      const trainingDate = new Date(training.date);
      return trainingDate.toLocaleDateString("pl-PL") === date.toLocaleDateString("pl-PL");
    });
    setSelectedTrainings(selectedTrainings);
  };

  // Formatowanie godziny na hh:mm
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", maxWidth: "500px", margin: "auto" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Wybierz datę</h2>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileClassName={tileClassName}
        tileContent={tileContent}
      />
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <h4 style={{ marginBottom: "5px" }}>Wybrana data:</h4>
        <p style={{ fontSize: "18px", color: "#333" }}>{selectedDate.toLocaleDateString()}</p>

        {/* Wyświetlanie treningów dla wybranej daty */}
        {selectedTrainings.length > 0 ? (
          <div>
            <h5>Treningi na ten dzień:</h5>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "10px" }}>
              {selectedTrainings.map((training, index) => {
                // Szukanie trenera i konia dla tego treningu
                const trainer = trainers.find((t) => t.userId === training.trainerId);
                const horse = horses.find((h) => h.horseId === training.horseId);

                return (
                  <div key={index} style={{ backgroundColor: "#ffffff", padding: "10px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
                    <p><strong>Godzina:</strong> {formatTime(training.timeStart + 1)} - {formatTime(training.timeEnd + 1)}</p>
                    <p><strong>Typ treningu:</strong> {training.trainingType}</p>
                    <p><strong>Trener:</strong> {trainer ? `${trainer.name} ${trainer.surname}` : "Nie zapisany Trener"}</p>
                    <p><strong>Koń:</strong> {horse ? horse.name : "Nie zapisany koń"}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p>Brak treningów w tym dniu.</p>
        )}
      </div>
    </div>
  );
}

export default ClientCalendar;
