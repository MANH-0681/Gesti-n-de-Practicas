import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/supervisor/sidebar'; // Ajusta la ruta según tu carpeta
import StudentTable from '../../components/supervisor/StudentTable';
import '../../styles/styles-supervisor/PracticasSupervisor.css';

const InicioSupervisor = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  
  // 1. Estado para almacenar los datos del backend
  const [data, setData] = useState({ supervisor: {}, statistics: {}, studentsList: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');
    const name = localStorage.getItem('user_name');

    // Protección de ruta
    if (!token || rol !== 'supervisor') {
      navigate('/login');
      return;
    }

    setNombre(name);

    // 2. Función para traer los datos del Dashboard
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/supervisors/dashboard-data`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("Error en la respuesta del servidor");
        }
      } catch (error) {
        console.error("Error conectando con la API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      {/* Cambia el <main> para usar la clase dashboard-main de tu CSS */}
      <main className="dashboard-main">
        
        {/* El header se queda fuera del área de scroll para que sea fijo */}
        <header className="dashboard-header">
          <h1>Prácticas</h1>
        </header>

        {loading ? (
          <div className="loading-container">
            Cargando información de practicantes...
          </div>
        ) : (
          /* Este div ya tiene overflow-y: auto en tu inicio.css */
          <div className="dashboard-content-area">
            <StudentTable students={data.studentsList} />
          </div>
        )}

      </main>
    </div>
  );
};

export default InicioSupervisor;
//mostrar en el dasboard en que empresas esta vinvulado el supervisor, y mostrar las practicas que tiene a cargo, con la opcion de ver mas detalles de cada practica (estudiante, empresa, estado, etc)
//ademas de un espacio para que el supervisor pueda agregar notas o comentarios sobre cada practica, para que el estudiante y la empresa puedan verlos y asi tener una mejor comunicacion entre las partes.