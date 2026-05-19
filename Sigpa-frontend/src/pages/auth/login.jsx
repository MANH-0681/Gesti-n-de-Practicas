import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, GraduationCap } from 'lucide-react';
import '../../styles/styles-auth/login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log("API URL:", import.meta.env.VITE_API_URL);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Guardar token y rol
        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', data.rol);

        // Guardar email
        const emailAGuardar = data.email || data.user_email || email;
        localStorage.setItem('user_email', emailAGuardar);

        // Guardar datos del usuario
        const userData = {
          first_name: data.first_name || data.nombre || '',
          last_name: data.last_name || '',
        };

        localStorage.setItem('user_data', JSON.stringify(userData));

        // También puedes guardar el nombre completo aparte si quieres
        localStorage.setItem(
          'user_name',
          `${userData.first_name} ${userData.last_name}`.trim()
        );

        // Redirección por roles
        if (data.rol === 'admin') {
          navigate('/inicio-admin');
        } else if (data.rol === 'teacher') {
          navigate('/inicio-teacher');
        } else if (data.rol === 'supervisor') {
          navigate('/inicio-supervisor');
        } else {
          navigate('/inicio-estudiante');
        }
      } else {
        alert(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error conectando al servidor:', error);
      alert('No se pudo conectar con el servidor');
    }
  };

  return (
    <div className="login-page">
      <header>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: '700',
            color: '#0D47A1',
          }}
        >
          <GraduationCap size={26} />
          SIGPA
        </div>
      </header>

      <main className="main-content">
        <div className="login-box">
          <form id="form-login" onSubmit={handleLogin}>
            <h2>Iniciar Sesión</h2>

            <div className="form-group">
              <label>Correo Institucional</label>

              <div
                style={{
                  position: 'relative',
                }}
              >
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />

                <input
                  type="email"
                  placeholder="correo@universidad.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    paddingLeft: '44px',
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Contraseña</label>

              <div
                style={{
                  position: 'relative',
                }}
              >
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    paddingLeft: '44px',
                  }}
                />
              </div>
            </div>

            <button type="submit">Entrar</button>

            <button type="button" onClick={() => navigate('/')}>
              Volver a Inicio
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
