import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  GraduationCap,
  LogIn,
  UserPlus,
} from 'lucide-react';

import '../styles/home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="left-panel">
        <div className="content">
          <GraduationCap
            size={80}
            color="#1E88E5"
            strokeWidth={1.5}
          />

          <h2>SIGPA</h2>

          <p>
            Sistema inteligente para la gestión
            y seguimiento académico.
          </p>
        </div>
      </div>

      <div className="right-panel">
        <div className="login-box">
          <div className="logo">
            <div className="logo-icon">
              <GraduationCap size={28} />
            </div>

            <h1>SIGPA</h1>
          </div>

          <div className="form-section">
            <h3>Si ya tienes cuenta:</h3>

            <button
              type="button"
              className="btn primary"
              onClick={() => navigate('/login')}
            >
              <LogIn size={18} />
              Iniciar Sesión
            </button>
          </div>

          <div className="form-section separator">
            <h3>Si es tu primera vez:</h3>

            <button
              type="button"
              className="btn secondary"
              onClick={() => navigate('/register')}
            >
              <UserPlus size={18} />
              Crear cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;