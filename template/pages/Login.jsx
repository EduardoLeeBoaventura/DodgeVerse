import React, { useState } from 'react';
import Button from '../components/Button';

const Login = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    console.log('Login:', { email, password });
    onNavigate('home');
  };

  return (
    <div className="page-container">
      <div className="auth-card">
        <h1>LOGIN</h1>
        <div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button onClick={handleSubmit}>Entrar</Button>
        </div>
        <p className="link-text">
          Não tem uma conta? <a href="#" onClick={() => onNavigate('register')}>Registre-se</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
