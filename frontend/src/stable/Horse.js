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
                alert(data.message); // Wyświetlenie komunikatu zwróconego przez serwer
                if (response.ok) {
                    setHorses(prevHorses => prevHorses.filter(horse => horse.horseId !== horseId)); // Usuwamy konia z listy
                }
            } catch (error) {
                alert("Wystąpił błąd podczas usuwania konia.");
            }
        }
    };

    return (
        <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
            <h2 style={{ color: "#dc3545", fontSize: "24px", textAlign: "center" }}>Koń w Stajni</h2>

            {/* Formularz dodawania konia */}
            <form onSubmit={handleAddHorse} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ marginBottom: "15px", width: "100%" }}>
                    <label htmlFor="name" style={{ fontWeight: "bold", display: "block" }}>Imię konia:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Wpisz imię konia"
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        width: "100%",
                    }}
                >
                    Dodaj konia
                </button>
            </form>

            <ul style={{ listStyleType: "none", padding: "0", marginTop: "20px" }}>
                {horses.map((horse) => (
                    <li key={horse.horseId} style={{ padding: "10px", margin: "5px 0", border: "1px solid #ccc", borderRadius: "5px" }}>
                        <span>{horse.name}</span>
                        <button
                            onClick={() => handleRemoveHorse(horse.horseId)}
                            style={{
                                marginLeft: "20px",
                                padding: "5px 10px",
                                backgroundColor: "#dc3545",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
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
