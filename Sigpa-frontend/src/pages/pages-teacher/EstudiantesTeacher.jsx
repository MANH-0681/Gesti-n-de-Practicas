import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/teacher/sidebar';
import StudentTable from '../../components/teacher/StudentTable';
import '../../styles/styles-teacher/EstudiantesTeacher.css';

const EstudiantesTeacher = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ studentsList: [] }); // Inicializamos con el objeto que esperamos
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (!token || rol !== 'teacher') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // 1. Usa la ruta real: /teachers/dashboard-data (que usa el middleware auth)
        // O usa la de prueba temporalmente: /teachers/test-dashboard/37
        const response = await fetch(`${import.meta.env.VITE_API_URL}/teachers/dashboard-data`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          // Según tu controlador, el objeto tiene: { teacher, statistics, studentsList }
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

    fetchData();
  }, [navigate]);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Mis Estudiantes en Prácticas</h1>
        </header>

        {loading ? (
          <div className="loading-container">Cargando...</div>
        ) : (
          <div className="dashboard-content-area">
            {/* Pasamos solo la lista de prácticas al componente tabla */}
            <StudentTable students={data.studentsList || []} />
          </div>
        )}
      </main>
    </div>
  );
};

export default EstudiantesTeacher;