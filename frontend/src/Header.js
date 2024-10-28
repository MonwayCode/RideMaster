import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Header() 
{
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId === null) {
      navigate("/login");
    }

    console.log("Zalogowany użytkownik :" + userId);

    if (userId) {
      (async () => {
        try {
          const response = await axios.get(`http://localhost:3001/name/${userId}`);
          const userName = response.data.name;
          setName(userName);
        } catch (error) {
          console.error("Błąd podczas pobierania danych", error);
        }
      })();
    }
  }, [navigate]);

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <header className="p-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#92000f' }}>
      <h1 className="mb-0">RideMaster</h1>
      <p className="mb-0" style={{ fontSize: '20px', marginRight: '60px' }}>Hej, {name}!</p>
      <button className="btn btn-light" onClick={handleLogout}>
        Wyloguj się
      </button>
    </header>
  );
}

export default Header;
