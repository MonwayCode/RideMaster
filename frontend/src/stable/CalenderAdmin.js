import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { useParams } from "react-router-dom";

function CalendarAdmin() {
  const { stableId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [trainings, setTrainings] = useState([]);
  const [selectedTrainings, setSelectedTrainings] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [horses, setHorses] = useState([]);
  const [participants, setParticipants] = useState([]);
  const userId = window.localStorage.getItem("userId");

  // Pobieranie treningów
  const fetchTrainings = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/trainings/${stableId}`);
      setTrainings(response.data);
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

  // Pobieranie uczestników
  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/customers/participants/${stableId}`);
      setParticipants(response.data);
    } catch (error) {
      console.error("Błąd przy pobieraniu uczestników:", error);
    }
  };

  useEffect(() => {
    fetchTrainings();
    fetchTrainers();
    fetchHorses();
    fetchParticipants();
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
        const hasTrainerTraining = trainingsOnDate.some(
          training => training.trainerId === Number(userId)
        );
        return hasTrainerTraining ? "highlight-trainer-day" : "has-trainings";
      }
    }
  };

  // Funkcja do wyświetlania kropki na kalendarzu
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
          const color = training.trainerId === Number(userId) ? "#FF7F50" : getTrainingColor(training.trainingType);
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
        return "#7D7F7D";
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

        {selectedTrainings.length > 0 ? (
          <div>
            <h5>Treningi na ten dzień:</h5>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
              {selectedTrainings.map((training, index) => {
                const trainer = trainers.find(t => t.userId === training.trainerId);
                const horse = horses.find(h => h.horseId === training.horseId);
                const client = participants.find((p) => p.userId === training.clientId);

                return (
                  <div key={index} style={{
                    backgroundColor: training.trainerId === Number(userId) ? "#FFF0E1" : "#ffffff",
                    padding: "10px", 
                    borderRadius: "8px", 
                  }}>
                    <p><strong>Godzina:</strong> {formatTime(training.timeStart)} - {formatTime(training.timeEnd)}</p>
                    <p><strong>Typ treningu:</strong> {training.trainingType}</p>
                    <p><strong>Trener:</strong> {trainer ? `${trainer.name} ${trainer.surname}` : "Brak danych"}</p>
                    <p><strong>Uczestnik:</strong> {client ? `${client.name} ${client.surname}` : "Brak danych"}</p>
                    <p><strong>Koń:</strong> {horse ? horse.name : "Brak danych"}</p>
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

export default CalendarAdmin;
