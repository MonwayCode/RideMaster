import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Horse() {
    const { stableId } = useParams(); // Pobieramy stableId z URL
    const [horses, setHorses] = useState([]);
    const [name, setName] = useState(""); // Stan przechowujący imię konia

    // Pobranie listy koni po załadowaniu komponentu
    useEffect(() => {
        const fetchHorses = async () => {
            try {
                const response = await fetch(`http://localhost:3001/horses/${stableId}`);
                const data = await response.json();
                setHorses(data); // Ustawiamy stan z danymi koni
            } catch (error) {
                console.error("Błąd podczas pobierania koni:", error);
            }
        };

        fetchHorses();
    }, [stableId]);

    // Obsługuje dodanie konia
    const handleAddHorse = async (e) => {
        e.preventDefault();

        if (!name) {
            alert("Imię konia jest wymagane.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/horses/addHorse", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, stableId }),
            });

            const data = await response.json();
            alert(data.message); // Wyświetlenie komunikatu zwróconego przez serwer
            if (response.ok) {
                setHorses(prevHorses => [...prevHorses, { name, stableId }]); // Dodajemy konia do stanu
                setName(""); // Resetujemy pole formularza
            }
        } catch (error) {
            alert("Wystąpił błąd podczas dodawania konia.");
        }
    };

    // Obsługuje usunięcie konia
    const handleRemoveHorse = async (horseId) => {
        if (window.confirm("Czy na pewno chcesz usunąć tego konia?")) {
            try {
                const response = await fetch(`http://localhost:3001/horses/removeHorse/${horseId}`, {
                    method: "DELETE",
                });

                const data = await response.json();
                if (response.ok) {
                    setHorses(prevHorses => prevHorses.filter(horse => horse.horseId !== horseId)); // Usuwamy konia z listy
                }
            } catch (error) {
                alert("Wystąpił błąd podczas usuwania konia.");
            }
        }
    };

    return (
        <div
        style={{
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
          maxWidth: "600px",
          margin: "auto",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            color: "#dc3545",
            fontSize: "28px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Konie w Stajni
        </h2>
      
        {/* Formularz dodawania konia */}
        <form
          onSubmit={handleAddHorse}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <label
              htmlFor="name"
              style={{ fontWeight: "bold", marginBottom: "5px", fontSize: "16px" }}
            >
              Imię konia:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Wpisz imię konia"
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ced4da",
                fontSize: "16px",
                width: "100%",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "12px 25px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s",
              width: "100%",
              fontSize: "16px",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
          >
            Dodaj konia
          </button>
        </form>
      
        <ul style={{ listStyleType: "none", padding: "0", marginTop: "30px" }}>
          {horses.map((horse) => (
            <li
              key={horse.horseId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                margin: "10px 0",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span style={{ fontSize: "18px", fontWeight: "500" }}>{horse.name}</span>
              <button
                onClick={() => handleRemoveHorse(horse.horseId)}
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
              >
                Usuń
              </button>
            </li>
          ))}
        </ul>
      </div>
      
    );
}

export default Horse;
