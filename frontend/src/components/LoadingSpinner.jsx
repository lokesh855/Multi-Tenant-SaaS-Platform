import '../styles/LoadingSpinner.css';

const LoadingSpinner = ({ isVisible = false, message = 'Loading...' }) => {
  if (!isVisible) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
