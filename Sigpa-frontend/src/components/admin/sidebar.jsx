import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Importamos para la redirección
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  Settings,
  LogOut,
  GraduationCap,
  UserCircle,
  Building,
  Building2,
} from 'lucide-react';

import '../../styles/styles-teacher/sidebar.css'; // Asegúrate de tener este archivo CSS para los estilos de la barra lateral

const Sidebar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ nombre: '', email: '' });

  useEffect(() => {
    const nombre = localStorage.getItem('user_name');
    const email = localStorage.getItem('user_email');

    setUserData({

      nombre: nombre|| 'Usuario',
      email: email || 'usuario@correo.com'
    })
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
        <NavLink to="/inicio-admin" className={({ isActive }) => (isActive ? 'active' : '')}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink to="/perfil-admin" className={({ isActive }) => (isActive ? 'active' : '')}>
          <UserCircle size={20} />
          Perfil
        </NavLink>

        <NavLink to="/empresas" className={({ isActive }) => (isActive ? 'active' : '')}>
          <Building2 size={20} />
          Empresas
        </NavLink>

        <NavLink to="/vacantes" className={({ isActive }) => (isActive ? 'active' : '')}>
          <Users size={20} />
          Vacantes
        </NavLink>
        
        <NavLink to="/practicas" className={({ isActive }) => (isActive ? 'active' : '')}>
          <GraduationCap size={20} />
          Prácticas
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