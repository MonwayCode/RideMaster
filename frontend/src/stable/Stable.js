import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


import Header from "../Header";
import Calendar from "./Calender";
import Participants from "./Participants";

function Stable() {

  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || {};

  const [activeTab, setActiveTab] = useState("calendar");

  const getTabsForRole = (role) => {
    if (role === "owner" || role === "admin") {
      return [
        { id: "calendar", label: "Kalendarz" },
        { id: "trainings", label: "Treningi" },
        { id: "participants", label: "Uczestnicy" },
        { id: "info", label: "Informacje" },
      ];
    } else if (role === "client") {
      return [
        { id: "calendar", label: "Kalendarz" },
        { id: "trainings", label: "Treningi" },
        { id: "info", label: "Informacje" },
      ];
    }
    return [];
  };

  const tabs = getTabsForRole(role);

  const renderTabContent = () => {
    switch (activeTab) {
      case "calendar":
        return <Calendar />;
      case "trainings":
        return <div>Treningi Content</div>;
      case "participants":
        return <Participants />
      case "info":
        return <div>Informacje Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-dark text-white min-vh-100">
      <Header />

      <div className="container mt-4">
        <div className="card mb-3">
          <div className="card-body">

            <ul className="nav nav-tabs">
              {tabs.map((tab) => (
                <li className="nav-item" key={tab.id}>
                  <button
                    className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              {renderTabContent()}
            </div>
            <div className="text-center mt-4">
              <button className="btn btn-danger" onClick={() => navigate("/")}>
                Wróć na stronę główną
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stable;
