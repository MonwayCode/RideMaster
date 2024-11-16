import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios"; 
import { useNavigate } from 'react-router-dom';

import Header from "../Header";

function Search() {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [stables, setStables] = useState([]); 
  const [selectedStable, setSelectedStable] = useState(null);
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    const fetchStables = async () => {
      try {
        const response = await axios.get("http://localhost:3001/stables");
        setStables(response.data);
      } catch (error) {
        console.error("Błąd podczas wyszukiwania stajni: ", error);
      }
    };

    fetchStables();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStableClick = (stable) => {
    setSelectedStable(stable);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedStable(null);
  };

  const handleJoin = async () => {
    try 
    {
      const userId = window.localStorage.getItem("userId");
      const response = await axios.post("http://localhost:3001/customers/clients", {
        userId,
        stableId: selectedStable.stableId
      });
      if(response.status === 200)
      {
        alert("Pomyślnie zostałeś dodany do stajni");
        handleClose();
      }

    }
    catch (error) 
    {
        if (error.response && error.response.status === 400) 
        {
            alert("Już jestes w tej stajni");
            handleClose();
        }
        else 
        {
            throw error;
        }

    }
  };

  const filteredStables = stables.filter((stable) =>
    stable.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigate = useNavigate();

  return (
    <div className="bg-dark text-white min-vh-100">
      <Header />

      <div className="container mt-4">
        <h2 className="text-light text-center">Wyszukaj stajnię</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}> 
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Wpisz nazwę stajni..."
            value={searchTerm}
            onChange={handleSearch} 
            style={{ width: '300px' }}
          />
        </div>
        {searchTerm && filteredStables.length > 0 && (
          <div className="row mb-3">
            <div className="col-md-6 mx-auto"> 
              <ul className="list-group">
                {filteredStables.map((stable) => (
                  <button
                    key={stable.stableId}
                    className="list-group-item list-group-item-action text-danger text-center"
                    onClick={() => handleStableClick(stable)}
                  >
                    {stable.name}
                  </button>
                ))}
              </ul>
            </div>
          </div>
        )}

        <Modal
          show={showModal}
          onHide={handleClose}
          centered
          size="md"
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton style={{ backgroundColor: "#f8f9fa" }}>
            <Modal.Title style={{ color: "#dc3545", fontWeight: "bold" }}>
              {selectedStable?.name}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ padding: "30px", textAlign: "center" }}>
            <p style={{ fontSize: "16px", color: "#343a40", marginBottom: "20px" }}>
              <strong>Lokalizacja:</strong> {selectedStable?.location}
            </p>
            <button
              className="btn btn-danger"
              onClick={handleJoin}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "5px",
                transition: "background-color",
              }}
            >
              Dołącz
            </button>
          </Modal.Body>
        </Modal>

        <div className="text-center mt-4">
          <button className="btn btn-danger" onClick={() => navigate("/")}>
            Wróć na stronę główną
        </button>
        </div>
      </div>
    </div>
  );
}

export default Search;
