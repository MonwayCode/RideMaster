import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";


function Training() {
  const [trainings, setTrainings] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [horses, setHorses] = useState([]);
  const userId = localStorage.getItem("userId"); // Pobranie userId z localStorage
  const { stableId } = useParams();

  // Funkcje do pobierania danych
  const fetchTrainings = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/trainings/${stableId}`);
      const userTrainings = response.data.filter(training => training.clientId === Number(userId)); // Filtrowanie po userId
      setTrainings(userTrainings);
    } catch (error) {
      console.error("Błąd przy pobieraniu treningów:", error);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/customers/participants/${stableId}`);
      setParticipants(response.data);
    } catch (error) {
      console.error("Błąd przy pobieraniu uczestników:", error);
    }
  };

  const fetchTrainers = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/customers/trainers/${stableId}`);
      setTrainers(response.data);
    } catch (error) {
      console.error("Błąd przy pobieraniu trenerów:", error);
    }
  };

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
    fetchParticipants();
    fetchTrainers();
    fetchHorses();
  }, [stableId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL");
  };

  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}Z`);
    return date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  };

  const handleCancelTraining = async (lessonId) => {
    if (window.confirm("Czy na pewno chcesz odwołać ten trening?")) {
      try {
        await axios.put(`http://localhost:3001/trainings/canceltraining/${lessonId}`, {
          status: "Odwołane",
        });
        fetchTrainings(); // Odświeżenie listy treningów
        alert("Trening został odwołany!");
      } catch (error) {
        console.error("Błąd przy odwoływaniu treningu:", error);
        alert("Wystąpił błąd podczas odwoływania treningu.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Moje treningi</h2>
      <Table striped bordered hover responsive className="text-center align-middle">
        <thead>
          <tr>
            <th>Data</th>
            <th>Godzina rozpoczęcia</th>
            <th>Godzina zakończenia</th>
            <th>Trener</th>
            <th>Koń</th>
            <th>Typ treningu</th>
            <th>Status</th>
            <th>Akcja</th>
          </tr>
        </thead>
        <tbody>
          {trainings.length > 0 ? (
            trainings.map((training) => {
              const trainer = trainers.find((t) => t.userId === training.trainerId);
              const horse = horses.find((h) => h.horseId === training.horseId);

              return (
                <tr key={training.lessonId}>
                  <td>{formatDate(training.date)}</td>
                  <td>{formatTime(training.timeStart)}</td>
                  <td>{formatTime(training.timeEnd)}</td>
                  <td>{trainer ? `${trainer.name} ${trainer.surname}` : "Brak danych"}</td>
                  <td>{horse ? horse.name : "Brak danych"}</td>
                  <td>{training.trainingType}</td>
                  <td>{training.status}</td>
                  <td>
                    {training.status !== "Odwołane" && (
                      <Button
                        variant="danger"
                        onClick={() => handleCancelTraining(training.lessonId)}
                        className="w-100"
                      >
                        Odwołaj
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                Brak treningów do wyświetlenia.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default Training;
