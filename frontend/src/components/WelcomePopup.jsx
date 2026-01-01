import { useState, useEffect } from "react";
import "../styles/WelcomePopup.css";

const WelcomePopup = ({ user }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="welcome-popup">
      <div className="popup-content">
        <div className="popup-icon">👋</div>
        <div className="popup-text">
          <h3>Welcome back!</h3>
          <p>{user?.fullName || 'User'}</p>
        </div>
        <button 
          className="popup-close"
          onClick={() => setIsVisible(false)}
          aria-label="Close welcome popup"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default WelcomePopup;
