import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Participants() {
  const { stableId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState("owner"); // Zastąp wartość faktyczną rolą zalogowanego użytkownika

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(`http://localhost:3001/participants/${stableId}`);
        const data = await response.json();
        setParticipants(data);
      } catch (error) {
        console.error("Błąd podczas pobierania uczestników", error);
      }
    };

    fetchParticipants();
  }, [stableId]);

  const handleParticipantClick = (participant) => {
    setSelectedParticipant(participant);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedParticipant(null);
    setShowModal(false);
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
      <h2 style={{ color: "#dc3545", fontSize: "24px", textAlign: "center" }}>Lista uczestników</h2>

      <ul style={{ listStyleType: "none", padding: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {participants.length > 0 ? (
          participants.map((participant) => (
            <li
              key={participant.userId}
              style={{
                padding: "10px",
                margin: "5px 0",
                border: "1px solid #ccc",
                borderRadius: "5px",
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onClick={() => handleParticipantClick(participant)}
            >
              <span style={{ fontWeight: "bold", color: "#333" }}>{participant.name} {participant.surname}</span>
            </li>
          ))
        ) : (
          <p>Brak uczestników stajni.</p>
        )}
      </ul>

      {showModal && selectedParticipant && (
        <Modal
          participant={selectedParticipant}
          onClose={handleCloseModal}
          currentUserRole={currentUserRole}
          setParticipants={setParticipants}
        />
      )}
    </div>
  );
}

function Modal({ participant, onClose, currentUserRole, setParticipants }) {
  const [isAdmin, setIsAdmin] = useState(participant.role === "admin" || participant.role === "owner");

  const toggleRole = async () => {
    try {
      const response = await fetch(`http://localhost:3001/role/${participant.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: isAdmin ? "client" : "admin" }),
      });
  
      if (response.ok) {
        const updatedRole = isAdmin ? "client" : "admin";
        setIsAdmin(!isAdmin);
        setParticipants((prev) =>
          prev.map((p) => (p.userId === participant.userId ? { ...p, role: updatedRole } : p))
        );
      } else {
        console.error("Błąd aktualizacji roli");
      }
    }
    catch (error) 
    {
        throw error;
    }
  };
  

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        width: "300px",
        position: "relative",
      }}>
        <button onClick={onClose} style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          border: "none",
          background: "none",
          fontSize: "16px",
          cursor: "pointer",
        }}>X</button>

        <h3 style={{ color: "#dc3545", fontSize: "20px", textAlign: "center" }}>Szczegóły Uczestnika</h3>

        <p><strong>Imię:</strong> {participant.name}</p>
        <p><strong>Nazwisko:</strong> {participant.surname}</p>
        <p><strong>Adres email:</strong> {participant.email}</p>
        <p><strong>Numer Telefonu:</strong> {participant.phone}</p>

        <label>
          <strong>Administrator:</strong>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={toggleRole}
            disabled={currentUserRole !== "owner"}
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>
    </div>
  );
}

export default Participants;
