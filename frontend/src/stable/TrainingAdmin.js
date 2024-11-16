import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";

function TreningAdmin() {
  const { stableId } = useParams();

  const [trainings, setTrainings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [horses, setHorses] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [formData, setFormData] = useState({
    clientId: "",
    trainerId: "",
    date: "",
    timeStart: "",
    timeEnd: "",
    horseId: "",
    trainingType: "",
    comment: "",
    status: "Oczekuje płatności",
    stableId: stableId,
  });

  useEffect(() => {
    // Fetch initial data
    fetchTrainings();
    fetchTrainers();
    fetchHorses();
    fetchParticipants();
  }, [stableId]);

  const fetchTrainings = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/trainings/${stableId}`);
      setTrainings(response.data);
    } catch (error) {
      console.error("Błąd przy pobieraniu treningów", error);
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

  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/customers/participants/${stableId}`);
      setParticipants(response.data);
    } catch (error) {
      console.error("Błąd przy pobieraniu uczestników:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" });
  };

  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}Z`);
    return date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  };

  const handleShowModal = (training = null) => {
    if (training) {
      // Check if the date is in the format YYYY-MM-DD
      const trainingDate = new Date(training.date);
      // Add 1 day to the date
      trainingDate.setDate(trainingDate.getDate() + 1);

      // Format date to yyyy-mm-dd (needed for date input)
      const formattedDate = trainingDate.toISOString().split("T")[0];

      setFormData({
        clientId: training.clientId,
        trainerId: training.trainerId,
        date: formattedDate,  // Use the formatted date + 1 day
        timeStart: training.timeStart,
        timeEnd: training.timeEnd,
        horseId: training.horseId,
        trainingType: training.trainingType,
        comment: training.comment,
        status: training.status,
        stableId: stableId,
      });
      setSelectedTraining(training);
      setEditMode(true);
    } else {
      setFormData({
        clientId: "",
        trainerId: "",
        date: "",
        timeStart: "",
        timeEnd: "",
        horseId: "",
        trainingType: "",
        comment: "",
        status: "Oczekuje płatności",
        stableId: stableId,
      });
      setSelectedTraining(null);
      setEditMode(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveTraining = async () => {
    const { clientId, trainerId, date, timeStart, timeEnd, horseId, trainingType, comment, status } = formData;

    // Validation - ensure date and times are provided
    if (!date || !timeStart || !timeEnd) {
      alert("Data, czas rozpoczęcia i czas zakończenia są wymagane!");
      return;
    }
    const formattedDate = new Date(date).toISOString().split("T")[0]; // Format date to yyyy-mm-dd

    try {
      if (editMode) 
      {
        const response = await axios.put(`http://localhost:3001/trainings/updatetraining/${selectedTraining.lessonId}`, {
          clientId,
          trainerId,
          date: formattedDate,  // Use the formatted date
          timeStart,
          timeEnd,
          horseId,
          trainingType,
          comment,
          status,
          stableId,
        });
        
        if(response.status === 200)
          {
            alert("Trening został pomyślnie zapisany!");
            handleCloseModal();
            fetchTrainings();
          }
      } 

      else 
      {
        const response = await axios.post("http://localhost:3001/trainings/newtraining", {
          clientId,
          trainerId,
          date: formattedDate,  // Use the formatted date
          timeStart,
          timeEnd,
          horseId,
          trainingType,
          comment,
          status,
          stableId,
        });
        if(response.status === 200)
          {
            alert("Trening został pomyślnie zapisany!");
            handleCloseModal();
            fetchTrainings();
          }
      }


    } catch (error) {
      console.error("Błąd przy zapisywaniu treningu:", error);
      alert("Wystąpił błąd podczas zapisywania treningu.");
    }
  };

  const handleDeleteTraining = async (lessonId) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten trening?")) {
      try {
        await axios.delete(`http://localhost:3001/trainings/removetraining/${lessonId}`);
        fetchTrainings(); // Refresh the list after deletion
        alert("Trening został pomyślnie usunięty!");
      } catch (error) {
        console.error("Błąd przy usuwaniu treningu:", error);
        alert("Wystąpił błąd podczas usuwania treningu.");
      }
    }
  };

  return (
    <div style={{padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "10px", margin: "auto",}}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Button variant="danger" onClick={() => handleShowModal()}>
          Dodaj trening
        </Button>
        <h2>Lista treningów</h2>
        <table className="table">
          <thead>
          <tr style={{ backgroundColor: "#343a40", color: "#fff" }}>
              <th
                style={{
                  padding: "12px",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: "500",
                  borderBottom: "2px solid #dee2e6",
                }}
              >
                Klient
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: "500",
                  borderBottom: "2px solid #dee2e6",
                }}
              >
                Trener
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: "500",
                  borderBottom: "2px solid #dee2e6",
                }}
              >
                Data
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: "500",
                  borderBottom: "2px solid #dee2e6",
                }}
              >
                Czas rozpoczęcia
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: "500",
                  borderBottom: "2px solid #dee2e6",
                }}
              >
                Czas zakończenia
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: "500",
                  borderBottom: "2px solid #dee2e6",
                }}
              >
                Koń
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: "500",
                  borderBottom: "2px solid #dee2e6",
                }}
              >
                Typ treningu
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: "500",
                  borderBottom: "2px solid #dee2e6",
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: "500",
                  borderBottom: "2px solid #dee2e6",
                }}
              >
                Akcja
              </th>
            </tr>
          </thead>
          <tbody>
            {trainings.map((training) => {
              const client = participants.find(p => p.userId === training.clientId);
              const trainer = trainers.find(t => t.userId === training.trainerId);
              const horse = horses.find(h => h.horseId === training.horseId);

              return (
                <tr key={training.lessonId}>
                  <td style={{ padding: "12px", textAlign: "center", fontSize: "16px" }}>
                    {client ? `${client.name} ${client.surname}` : "Nie znany Klient"}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center", fontSize: "16px" }}>
                    {trainer ? `${trainer.name} ${trainer.surname}` : "Nie zapisany Trener"}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center", fontSize: "16px" }}>
                    {formatDate(training.date)}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center", fontSize: "16px" }}>
                    {formatTime(training.timeStart)}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center", fontSize: "16px" }}>
                    {formatTime(training.timeEnd)}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center", fontSize: "16px" }}>
                    {horse ? horse.name : "Nie zapisany koń"}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center", fontSize: "16px" }}>
                    {training.trainingType}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center", fontSize: "16px" }}>
                    {training.status}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Button
                      variant="danger"
                      onClick={() => handleShowModal(training)}
                      style={{ marginRight: "8px", marginBottom: "3px" }} 
                    >
                      Edytuj
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteTraining(training.lessonId)}>
                      Usuń
                    </Button>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editMode ? "Edytowanie treningu" : "Dodawanie nowego treningu"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="clientId">
                    <Form.Label>Klient</Form.Label>
                    <Form.Control
                      as="select"
                      name="clientId"
                      value={formData.clientId}
                      onChange={handleInputChange}
                    >
                      <option value="">Wybierz klienta</option>
                      {participants.map((participant) => (
                        <option key={participant.userId} value={participant.userId}>
                          {participant.name} {participant.surname}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="trainerId">
                    <Form.Label>Trener</Form.Label>
                    <Form.Control
                      as="select"
                      name="trainerId"
                      value={formData.trainerId}
                      onChange={handleInputChange}
                    >
                      <option value="">Wybierz trenera</option>
                      {trainers.map((trainer) => (
                        <option key={trainer.userId} value={trainer.userId}>
                          {trainer.name} {trainer.surname}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="horseId">
                    <Form.Label>Koń</Form.Label>
                    <Form.Control
                      as="select"
                      name="horseId"
                      value={formData.horseId}
                      onChange={handleInputChange}
                    >
                      <option value="">Wybierz konia</option>
                      {horses.map((horse) => (
                        <option key={horse.horseId} value={horse.horseId}>
                          {horse.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="trainingType">
                    <Form.Label>Typ treningu</Form.Label>
                    <Form.Control
                      as="select"
                      name="trainingType"
                      value={formData.trainingType}
                      onChange={handleInputChange}
                    >
                      <option value="">Wybierz typ treningu</option>
                      <option value="indywidualna">Indywidualna</option>
                      <option value="grupowa">Grupowa</option>
                      <option value="ujeżdżeniowa">Ujeżdżeniowa</option>
                      <option value="skokowa">Skokowa</option>
                      <option value="hipoterapia">Hipoterapia</option>
                      <option value="lonża">Lonża</option>
                      <option value="oprowadzanka">Oprowadzanka</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="date">
                <Form.Label>Data</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="timeStart">
                    <Form.Label>Czas rozpoczęcia</Form.Label>
                    <Form.Control
                      type="time"
                      name="timeStart"
                      value={formData.timeStart}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="timeEnd">
                    <Form.Label>Czas zakończenia</Form.Label>
                    <Form.Control
                      type="time"
                      name="timeEnd"
                      value={formData.timeEnd}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="comment">
                <Form.Label>Uwagi</Form.Label>
                <Form.Control
                  as="textarea"
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="status">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Oczekuje płatności">Oczekuje płatności</option>
                  <option value="Zapłacone">Zapłacone</option>
                  <option value="Odwołane">Odwołane</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Zamknij
            </Button>
            <Button variant="primary" onClick={handleSaveTraining}>
              Zapisz Zmiany
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default TreningAdmin;
