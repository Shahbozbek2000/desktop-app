import { useEffect, useState } from "react";

function App() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);

  useEffect(() => {
    // Check if we're running in Electron
    if (window.electronAPI) {
      window.electronAPI.onUpdateAvailable(() => {
        setUpdateAvailable(true);
      });

      window.electronAPI.onUpdateDownloaded(() => {
        setUpdateAvailable(false);
        setUpdateDownloaded(true);
      });

      return () => {
        window.electronAPI.removeAllListeners("update_available");
        window.electronAPI.removeAllListeners("update_downloaded");
      };
    }
  }, []);

  const handleRestart = () => {
    if (window.electronAPI) {
      window.electronAPI.restartApp();
    }
  };

  return (
    <div className="app">
      <p
        style={{
          background: "green",
          padding: 10,
          color: "#fff",
          textTransform: "uppercase",
        }}
      >
        1.0.0 versiya
      </p>

      {updateAvailable && (
        <button
          style={{
            padding: "8px 16px",
            margin: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Yangilash yuklanmoqda...
        </button>
      )}

      {updateDownloaded && (
        <button
          onClick={handleRestart}
          style={{
            padding: "8px 16px",
            margin: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Qayta ishga tushirish
        </button>
      )}
    </div>
  );
}

export default App;
