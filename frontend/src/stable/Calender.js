// Calendar.js
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function CustomCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", maxWidth: "500px", margin: "auto" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Wybierz datę</h2>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
      />
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <h4 style={{ marginBottom: "5px" }}>Wybrana data:</h4>
        <p style={{ fontSize: "18px", color: "#333" }}>{selectedDate.toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default CustomCalendar;
