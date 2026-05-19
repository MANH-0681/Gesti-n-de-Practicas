import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  LogOut,
  GraduationCap,
  UserCircle,
} from 'lucide-react';

import '../../styles/styles-estudiante/sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ nombre: '', email: '' });

  useEffect(() => {
  try {
    const userRaw = localStorage.getItem('user_data');
    const emailRaw = localStorage.getItem('user_email');

    if (userRaw && userRaw !== "undefined" && userRaw !== "null") {
      const userParsed = JSON.parse(userRaw);

      if (userParsed && typeof userParsed === 'object') {
        setUserData({
          nombre: `${userParsed.first_name || ''} ${userParsed.last_name || ''}`.trim(),
          email: emailRaw || 'sin@correo.com'
        });
      }
    } else {
      console.warn("No se encontraron datos de usuario en localStorage");
    }
  } catch (error) {
    console.error("Error al leer datos del usuario:", error);
  }
}, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
	<GraduationCap
          size={70}
          color="white"
          strokeWidth={1.5}
        />
        <div className="logo-text">
          <h2>SIGPA</h2>

          <span>
            Sistema de Gestión en Prácticas Academicas
          </span>
        </div>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/inicio-estudiante" className={({ isActive }) => (isActive ? 'active' : '')}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink to="/perfil" className={({ isActive }) => (isActive ? 'active' : '')}>
          <UserCircle size={20} />
          Perfil
        </NavLink>

        <NavLink to="/evaluaciones" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FileText size={20} />
          Evaluaciones
        </NavLink>

        <NavLink to="/agenda" className={({ isActive }) => (isActive ? 'active' : '')}>
          <Calendar size={20} />
          Agenda
        </NavLink>

      </nav>

      <div className="sidebar-footer">
        <div className="user-info-container">
          <UserCircle size={35} className="user-icon" />
          <div className="user-details">
            <span className="user-name">{userData.nombre}</span>
            <span className="user-email">{userData.email}</span>
          </div>
        </div>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={18} />
        Cerrar sesión
      </button>
    </aside>
  );
};

export default Sidebar;