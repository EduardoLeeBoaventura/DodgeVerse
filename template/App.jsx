import React, { useState } from 'react';
import './styles/styles.css';
import BackgroundAnimation from './components/BackgroundAnimation';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const handleNavigate = (page) => setCurrentPage(page);

  return (
    <div className="app-container">
      <BackgroundAnimation />
      {currentPage === 'login' && <Login onNavigate={handleNavigate} />}
      {currentPage === 'register' && <Register onNavigate={handleNavigate} />}
      {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
    </div>
  );
};

export default App;
