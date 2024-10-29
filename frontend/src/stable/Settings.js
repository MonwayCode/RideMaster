import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Settings() 
{
    const { stableId } = useParams();

    const [currentUserRole, setCurrentUserRole] = useState("");
    const [reminderPreference, setReminderPreference] = useState("nothing");

    const userId = window.localStorage.getItem("userId");

    const navigate = useNavigate();


    useEffect(() => {
        const fetchUserRole = async () => {
        try {
            const response = await fetch(`http://localhost:3001/customers/list/${userId}`);
            const data = await response.json();
            setCurrentUserRole(data[0].role);
        } catch (error) {
            console.error("Błąd podczas pobierania roli użytkownika", error);
        }
        };

        fetchUserRole();
    }, [userId]);

    const handleReminderChange = (event) => {
        setReminderPreference(event.target.value);
    };

    const leaveStable = async () => {
        if (window.confirm("Czy na pewno chcesz opuścić stajnię?")) 
        {
            try 
            {
                const response = await fetch(`http://localhost:3001/customers/removeuser/${userId}`, {
                    method: "DELETE",
                });
                alert("Opuściłeś stajnię.");
                navigate("/"); 
            } 
            catch (error) 
            {
                throw error;
            }
        } 
    };

    const deleteStable = async () => {
        if (window.confirm("Czy na pewno chcesz usunąć stajnię?")) 
        {
            try 
            {
                const response = await fetch(`http://localhost:3001/customers/removestable/${stableId}`, {
                    method: "DELETE",
                });
                alert("Stajnia została usunięta.");
                navigate("/");
            } 
            catch (error) 
            {
                throw error;
            }
        }
    };


  const subscribeToNewsletter = () => {
    alert("Zapisano na newsletter.");
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
      <div style={{ margin: "20px 0" }}>
        <label>
          <strong>Preferencje przypomnienia o treningach:</strong>
          <select value={reminderPreference} onChange={handleReminderChange} style={{ marginLeft: "10px" }}>
            <option value="nothing">Nic</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>
        </label>
      </div>

      {currentUserRole === "client" && (
        <div>
          <button onClick={subscribeToNewsletter} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", width: "100%" }}>
            Zapisz się na newsletter
          </button>
          <button onClick={leaveStable} style={{ padding: "10px 20px", marginTop: "10px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", width: "100%" }}>
            Opuść stajnię
          </button>
        </div>
      )}

      {currentUserRole === "admin" && (
        <div>
          <button onClick={leaveStable} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", width: "100%" }}>
            Opuść stajnię
          </button>
        </div>
      )}

      {currentUserRole === "owner" && (
        <div>
          <button onClick={deleteStable} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", width: "100%" }}>
            Usuń stajnię
          </button>
        </div>
      )}
    </div>
  );
}

export default Settings;
