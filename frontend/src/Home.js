import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 

import Header from "./Header";

function Home()
{
  const [stables, setStables] = useState([]);

  const navigate = useNavigate();

  const userId = window.localStorage.getItem("userId");

  useEffect(() => {
    const fetchStables = async () => {
      try 
      {
        const response = await fetch(`http://localhost:3001/customers/list/${userId}`);
        const data = await response.json();
        setStables(data);
      } 
      catch (error) 
      {
        console.error("Błąd podczas pobierania stajni", error);
      }
    };

    fetchStables();
  }, [userId]);

  return (
    <div className="bg-dark text-white min-vh-100">
      <Header/>

      <div className="container mt-4">
        <div className="card bg-light mb-3">
          <div className="card-body">
            <h2 className="card-title text-dark" style = {{display: 'flex', justifyContent: 'center' }}>Wybierz swoją stajnię</h2>
            <ul className="list-group list-group-flush" >
              {stables.length > 0 ? (
                stables.map(stable => (
                  <li key={stable.stableId} className="list-group-item" style = {{fontSize : "20px", display: 'flex', justifyContent: 'center' }}>
                  <Link 
                    to={`/${stable.stableId}`} 
                    state = {{role : stable.role}}
                    className="text-danger"
                  >
                    {stable.name} - {stable.location}
                  </Link>
                  </li>
                ))
              ) : (
                <li className="list-group-item text-danger">Jeszcze nie należysz do żadnej stajni! Dołącz albo stwórz własną</li>
         
              )}
            </ul>
          </div>
        </div>
      
        <div className="card bg-light">
          <div className="card-body" style ={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn btn-danger me-2" onClick={() => navigate('/search')}>Dołącz do stajni</button>
            <button className="btn btn-danger" onClick={() => navigate('/newstable')}>Stwórz własną stajnię</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
