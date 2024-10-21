import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home()
{
  
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect( () => {
    const userId = localStorage.getItem('userId');

    if(userId === null) //Użytkownik musi być zalogowany by działać na stronie
    {
      navigate('/login');
    }

    console.log("Zalogowany użytkownik :" + userId); // DO USUNIĘCIA W PRZYSZŁOŚCI

    if (userId) 
    {
      (async () => {
        try 
        {
          const response = await axios.get(`http://localhost:3001/imie/${userId}`);
          const name = response.data.name;
          setName(name);
        } 
        catch (error)
        {
          console.error("Błąd podczas pobierania danych", error);
        }
      })(); 
    }
  }, []); 

  const handleLogout = (event) => {
    window.localStorage.removeItem("userId");
    navigate('/login');
  }

  return (
    <div className="bg-dark text-white min-vh-100">
      <form onSubmit={handleLogout}>
        <header className="p-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#92000f'}}>
          <h1 className="mb-0">RideMaster</h1>
          <p className="mb-0">Hej,{name}!</p> 
          <button className="btn btn-light" type="submit" >Wyloguj się</button>
        </header>
      </form>

      <div className="container mt-4">
        <div className="card bg-light mb-3">
          <div className="card-body">
            <h2 className="card-title text-dark">Wybierz swoją stajnię</h2>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <a href="#" className="text-danger">Stajnia A</a>
              </li>
              <li className="list-group-item">
                <a href="#" className="text-danger">Stajnia B</a>
              </li>
              <li className="list-group-item">
                <a href="#" className="text-danger">Stajnia C</a>
              </li>
            </ul>
          </div>
        </div>
      
        <div className="card bg-light">
          <div className="card-body">
            <button className="btn btn-danger me-2">Dołącz do stajni</button>
            <button className="btn btn-danger">Stwórz własną stajnię</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
