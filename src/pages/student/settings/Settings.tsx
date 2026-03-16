import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile";
import Fines from "./Fines";
import Notifications from "./Notifications";

const Settings = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState<"profile" | "fines" | "notifications">("profile");

  return (
    <div className="settings-all-sections">
      <button onClick={() => navigate(-1)} className="back-button">←</button>
      
      <div className="settings-tabs">
        <button 
          className={`settings-tab ${active === "profile" ? "active" : ""}`}
          onClick={() => setActive("profile")}
        >
          Profile
        </button>
        <button 
          className={`settings-tab ${active === "fines" ? "active" : ""}`}
          onClick={() => setActive("fines")}
        >
          Fines
        </button>
        <button 
          className={`settings-tab ${active === "notifications" ? "active" : ""}`}
          onClick={() => setActive("notifications")}
        >
          Notifications
        </button>
      </div>

      <section className="settings-section-item">
        {active === "profile" && <Profile />}
        {active === "fines" && <Fines />}
        {active === "notifications" && <Notifications />}
      </section>
    </div>
  );
};

export default Settings;
