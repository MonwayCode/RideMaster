import React from "react";
import { useNavigate } from "react-router-dom"; 

import Header from "./Header";

function Home()
{
  const navigate = useNavigate();

  return (
    <div className="bg-dark text-white min-vh-100">
      <Header/>

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
            <button className="btn btn-danger" onClick={() => navigate("/newstable")}>Stwórz własną stajnię</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
