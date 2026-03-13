import { useState, useEffect } from 'react';
import LibrosApp from "./Libros";
import Login from './Login';
import Register from './Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
  };

  return (
    <div>
      {isAuthenticated ? (
        <LibrosApp onLogout={handleLogout} /> // Cambiado a LibrosApp
      ) : showRegister ? (
        <Register 
          onRegisterSuccess={handleRegisterSuccess} 
          onSwitchToLogin={() => setShowRegister(false)} 
        />
      ) : (
        <Login 
          onLoginSuccess={handleLoginSuccess} 
          onSwitchToRegister={() => setShowRegister(true)} 
        />
      )}
    </div>
  );
}

export default App;