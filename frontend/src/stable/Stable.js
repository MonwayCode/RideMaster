import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../Header";
import Calendar from "./Calender";
import CalendarAdmin from "./CalenderAdmin";
import Participants from "./Participants";
import Settings from "./Settings";
import Information from "./Information";
import TrainingAdmin from "./TrainingAdmin";
import Training from "./Training";
import Horses from "./Horse";

function Stable() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || {};

  const getDefaultTab = (role) => {
    if (role === "owner" || role === "admin") {
      return "calendarAdmin";
    } else if (role === "client") {
      return "calendar";
    }
    return "calendar"; // Domyślna zakładka
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab(role));

  const getTabsForRole = (role) => {
    if (role === "owner" || role === "admin") {
      return [
        { id: "calendarAdmin", label: "Kalendarz" },
        { id: "trainingsAdmin", label: "Treningi" },
        { id: "participants", label: "Uczestnicy" },
        { id: "info", label: "Informacje" },
        { id: "settings", label: "Ustawienia" },
        { id: "horses", label: "Konie"}
      ];
    } else if (role === "client") {
      return [
        { id: "calendar", label: "Kalendarz" },
        { id: "trainings", label: "Treningi" },
        { id: "info", label: "Informacje" },
        { id: "settings", label: "Ustawienia" },
      ];
    }
    return [];
  };

  const tabs = getTabsForRole(role);

  const renderTabContent = () => {
    switch (activeTab) {
      case "calendar":
        return <Calendar />;
      case "calendarAdmin":
         return <CalendarAdmin />
      case "trainingsAdmin":
        return <TrainingAdmin />;
      case "trainings":
        return <Training />
      case "participants":
        return <Participants />;
      case "info":
        return <Information />
      case "settings":
        return <Settings />;
      case "horses":
        return <Horses />
      default:
        return null;
    }
  };

  return (
    <div className="bg-dark text-white min-vh-100">
      <Header />

      <div className="container mt-4" style={{ overflow: 'auto'}}>
        <div className="card mb-3" >
          <div className="card-body">
            <ul className="nav nav-tabs d-flex justify-content-center"> 
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
