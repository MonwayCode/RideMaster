import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";

function Information() {
    const { stableId } = useParams();
    const [events, setEvents] = useState([]);
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null); // Przechowywanie wybranego wydarzenia
    const [newEvent, setNewEvent] = useState({
        title: "",
        shortDescription: "",
        longDescription: "",
        imageUrl: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState(""); // Obsługa błędów
    const [successMessage, setSuccessMessage] = useState(""); // Komunikat o powodzeniu
    const userId = window.localStorage.getItem("userId");

    // Załadowanie wydarzeń i roli użytkownika
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/events/${stableId}`);
                const eventsWithFullImageUrl = response.data.map(event => ({
                    ...event,
                    imageUrl: `http://localhost:3001/uploads/${event.imageUrl}`, 
                }));
                setEvents(eventsWithFullImageUrl);
            } catch (error) {
                console.error("Błąd podczas pobierania wydarzeń", error);
            }
        };

        const fetchUserRole = async () => {
            try {
                const response = await fetch(`http://localhost:3001/customers/list/${userId}`);
                const data = await response.json();
                setCurrentUserRole(data[0].role);
            } catch (error) {
                console.error("Błąd podczas pobierania roli użytkownika", error);
            }
        };

        fetchEvents();
        fetchUserRole();
    }, [stableId, userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    // Funkcja do dodania wydarzenia
    const handleAddEvent = async () => {
        if (!newEvent.title || !newEvent.shortDescription || !newEvent.longDescription) {
            setErrorMessage("Wszystkie pola są wymagane!");
            return;
        }

        const formData = new FormData();
        formData.append("title", newEvent.title);
        formData.append("shortDescription", newEvent.shortDescription);
        formData.append("longDescription", newEvent.longDescription);
        formData.append("stableId", stableId);
        
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const response = await axios.post("http://localhost:3001/events/newevent", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            
            setEvents((prevEvents) => [...prevEvents, response.data]);
            setSuccessMessage("Wydarzenie zostało pomyślnie dodane!");
            setErrorMessage(""); // Wyczyszczenie błędu, jeśli dodanie się udało
            setShowModal(false);
            setNewEvent({ title: "", shortDescription: "", longDescription: "", imageUrl: "" });
            setImageFile(null); // Wyczyszczenie pliku
        } catch (error) {
            setErrorMessage("Wystąpił błąd podczas dodawania wydarzenia. Spróbuj ponownie.");
            console.error("Błąd podczas dodawania wydarzenia:", error);
        }
    };

    // Funkcja do usuwania wydarzenia
    const handleDeleteEvent = async (eventId) => {
        try {
            // Usuwanie wydarzenia z serwera
            await axios.delete(`http://localhost:3001/events/removeevent/${eventId}`);
            
            // Zaktualizowanie listy wydarzeń po usunięciu
            setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
            
            setSuccessMessage("Wydarzenie zostało pomyślnie usunięte!");
            setErrorMessage(""); // Wyczyszczenie komunikatu o błędzie
            setShowModal(false); // Zamknij modal
            setSelectedEvent(null); // Resetowanie wybranego wydarzenia
        } catch (error) {
            setErrorMessage("Wystąpił błąd podczas usuwania wydarzenia. Spróbuj ponownie.");
            console.error("Błąd podczas usuwania wydarzenia:", error);
        }
    };

    // Funkcja do otwierania szczegółów wydarzenia
    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setShowModal(true); // Otwórz modal z pełnym widokiem
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setErrorMessage(""); // Wyczyszczenie błędów przy zamknięciu
        setSuccessMessage(""); // Wyczyszczenie komunikatu sukcesu
        setSelectedEvent(null); // Wyczyszczenie wybranego wydarzenia
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center text-danger">Lista Wydarzeń</h2>

            {/* Przycisk "Dodaj Wydarzenie" widoczny tylko dla admina i właściciela */}
            {["admin", "owner"].includes(currentUserRole) && (
                <div className="d-flex justify-content-center mb-3">
                    <button onClick={() => setShowModal(true)} className="btn btn-danger">
                        Dodaj wydarzenie
                    </button>
                </div>
            )}

            {/* Lista wydarzeń */}
            <ul style={{ padding: "0 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                {events.map((event) => (
                    <li
                        key={event.id}
                        style={{
                            padding: "10px",
                            margin: "5px 0",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => handleEventClick(event)}
                    >
                        <div style={{ textAlign: 'center', width: '100%' }}>
                            <h3 className="font-weight-bold">{event.title}</h3>
                            <p style={{marginRight: '5px'}}>{event.shortDescription}</p>
                        </div>
                        <img
                            src={event.imageUrl}
                            style={{margin: '5px', maxWidth: "150px", maxHeight: "70px", borderRadius: "5px" }}
                            alt={event.title}
                        />
                    </li>
                ))}
            </ul>

            {/* Modal z pełnymi szczegółami wydarzenia */}
            <Modal show={showModal && selectedEvent} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontWeight: 'bold', textAlign: 'center', width: '100%' }}>
                        {selectedEvent ? selectedEvent.title : ''}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    {selectedEvent && (
                        <div className="d-flex align-items-center">
                            <div className="mr-4">
                                <img src={selectedEvent.imageUrl} style={{ maxHeight: "200px", maxWidth: '200px', marginRight: '5px' }} />
                            </div>
                            <div style={{padding: "10px"}}>
                                <p>{selectedEvent.longDescription}</p>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {["admin", "owner"].includes(currentUserRole) && selectedEvent && (
                        <Button variant="danger" onClick={() => handleDeleteEvent(selectedEvent.id)}>
                            Usuń
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            {/* Modal do dodawania nowego wydarzenia */}
            <Modal show={showModal && !selectedEvent} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontWeight: 'bold', textAlign: 'center', width: '100%' }}>
                        Dodawanie nowego wydarzenia
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    <Form>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Tytuł</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={newEvent.title}
                                onChange={handleInputChange}
                                placeholder="Wprowadź tytuł wydarzenia"
                            />
                        </Form.Group>
                        <Form.Group controlId="formShortDescription">
                            <Form.Label>Krótki opis</Form.Label>
                            <Form.Control
                                type="text"
                                name="shortDescription"
                                value={newEvent.shortDescription}
                                onChange={handleInputChange}
                                placeholder="Krótki opis wydarzenia"
                            />
                        </Form.Group>
                        <Form.Group controlId="formLongDescription">
                            <Form.Label>Długi opis</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="longDescription"
                                value={newEvent.longDescription}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Dłuższy opis wydarzenia"
                            />
                        </Form.Group>
                        <Form.Group controlId="formImage">
                            <Form.Label>Wybierz zdjęcie</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Zamknij
                    </Button>
                    <Button variant="primary" onClick={handleAddEvent}>
                        Dodaj
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Information;
