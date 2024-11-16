import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Participants() 
{
  const { stableId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState();

  const userId = window.localStorage.getItem("userId");

  useEffect(() => {
    const fetchParticipants = async () => {
      try 
      {
        const response = await fetch(`http://localhost:3001/customers/participants/${stableId}`);
        const allPart = await response.json(); //Lista wszystkich uczestników 
        const filtrPart = allPart.filter(participant => String(participant.userId) !== String(userId)); //lista bez aktualnie zalogowanego zalogowanego
        setParticipants(filtrPart);
      } 
      catch (error) 
      {
        console.error("Błąd podczas pobierania uczestników", error);
      }
    };//Wyciąganie z bazy danych wszystkich uczestników którzy dołączyli do stajni

    const fetchUserRoles = async () => {
      try 
      {
        const response = await fetch(`http://localhost:3001/customers/list/${userId}`);
        const data = await response.json();
        const userRole = data[0].role; //Z bazy danych otrzymujemy tablice z różnymi danymi i w ten sposób wyciągam tylko tą która jest potrzebna
        setCurrentUserRole(userRole);
      }
      catch (error)
      {
        console.error("Błąd podczas pobierania roli użytkownika", error);
      }
    };//Wyciąganie z bazy danych informacji o roli jaką ma aktualnie zalogowany uczestnik

    fetchParticipants();
    fetchUserRoles();
  }, [stableId, userId]);

  const handleParticipantClick = (participant) => {
    setSelectedParticipant(participant);
    setShowModal(true);
  };//Pokazanie okienka pop-up które pokazuje informacje o danych uczestniku

  const handleCloseModal = () => {
    setSelectedParticipant(null);
    setShowModal(false);
  };//Zamknięcie okienka pop-up które pokazuje informacje o danych uczestniku

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
      const response = await fetch(`http://localhost:3001/customers/role/${participant.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: isAdmin ? "client" : "admin" }),
      });
  
      if (response.ok) 
        {
        const updatedRole = isAdmin ? "client" : "admin";
        setIsAdmin(!isAdmin);
        setParticipants((prev) =>
          prev.map((p) => (p.userId === participant.userId ? { ...p, role: updatedRole } : p))
        );
      } 
      else 
      {
        console.error("Błąd aktualizacji roli");
      }
    }
    catch (error) 
    {
        throw error;
    }
  };//Dodawanie i usuwanie uprawnień administratorskich 
  
  const removeParticipant = async () => {
    try 
    {
      const response = await fetch(`http://localhost:3001/customers/removeuser/${participant.userId}`, {
        method: "DELETE",
      });

      if (response.ok) 
      {
        setParticipants((prev) => prev.filter((p) => p.userId !== participant.userId));
        alert("Uczestnik został usunięty ze stajni.");
        onClose(); 
      }
      else 
      {
        console.error("Błąd usuwania uczestnika");
      }
    } 
    catch (error) 
    {
      console.error("Błąd podczas usuwania uczestnika", error);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(5px)", // Dodanie efektu rozmycia
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "12px",
          width: "400px",
          maxWidth: "90%",
          position: "relative",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          transform: "scale(1)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        {/* Przycisk zamykania */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            border: "none",
            background: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "#dc3545",
            transition: "color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.color = "#c82333")}
          onMouseOut={(e) => (e.target.style.color = "#dc3545")}
        >
          ✕
        </button>

        {/* Tytuł */}
        <h3
          style={{
            color: "#dc3545",
            fontSize: "22px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Szczegóły Uczestnika
        </h3>

        {/* Informacje o uczestniku */}
        <div style={{ marginBottom: "15px" }}>
          <p style={{ fontSize: "16px" }}>
            <strong>Imię:</strong> {participant.name}
          </p>
          <p style={{ fontSize: "16px" }}>
            <strong>Nazwisko:</strong> {participant.surname}
          </p>
          <p style={{ fontSize: "16px" }}>
            <strong>Adres email:</strong> {participant.email}
          </p>
          <p style={{ fontSize: "16px" }}>
            <strong>Numer Telefonu:</strong> {participant.phone}
          </p>
        </div>

        {/* Checkbox do zmiany roli */}
        <label style={{ display: "flex", alignItems: "center", fontSize: "16px" }}>
          <strong>Administrator:</strong>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={toggleRole}
            disabled={currentUserRole !== "owner"}
            style={{
              marginLeft: "10px",
              transform: "scale(1.3)",
              cursor: currentUserRole === "owner" ? "pointer" : "not-allowed",
            }}
          />
        </label>

        {/* Przycisk usunięcia uczestnika */}
        {currentUserRole === "owner" && (
          <button
            onClick={removeParticipant}
            style={{
              marginTop: "25px",
              padding: "12px 20px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              width: "100%",
              fontSize: "16px",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
          >
            Usuń uczestnika
          </button>
        )}
      </div>
    </div>

  );
}

export default Participants;
