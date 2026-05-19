import React, { useEffect, useState } from 'react';
import {
  ClipboardList,
  BookOpen,
  CheckCircle,
  GraduationCap,
  UserCheck,
  Mail
} from 'lucide-react';

import Sidebar from '../../components/teacher/sidebar';
import StatCard from '../../components/teacher/statcard';
import '../../styles/styles-teacher/InicioTeacher.css';

const InicioTeacher = () => {
  const [dashboardData, setDashboardData] = useState({
    teacher: null,
    statistics: {
      totalStudents: 0,
      totalEvaluations: 0, // Nuevo campo
      averageRating: 0     // Nuevo campo
    },
    studentsList: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem('token');

        const response = await fetch(`${apiUrl}/teachers/dashboard-data`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          setDashboardData(result);
        }
      } catch (error) {
        console.error("Error al traer datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // calculos para graficos
  const getCareerDistribution = () => {
    const counts = {};
    dashboardData.studentsList.forEach(item => {
      const careerName = item.students?.careers?.name || 'No especificada';
      counts[careerName] = (counts[careerName] || 0) + 1;
    });
    
    const total = dashboardData.studentsList.length || 1;
    return Object.keys(counts).map(career => ({
      name: career,
      count: counts[career],
      percentage: ((counts[career] / total) * 100).toFixed(0)
    }));
  };

  const careerData = getCareerDistribution();

  if (loading) {
    return <div className="loading-container">Cargando estadísticas del panel...</div>;
  }

 // 2. Cálculos derivados para las tarjetas
  const totalSeguimientosRealizados = dashboardData.studentsList.reduce(
    (acc, practice) => {
      // DEBUG PARA INGENIERÍA: 
      // Mira el primer seguimiento de la lista para ver qué campos trae
      if (practice.follow_ups?.length > 0) {
        console.log("Campos disponibles en el seguimiento:", Object.keys(practice.follow_ups[0]));
        console.log("Valor de 'active' en el primero:", practice.follow_ups[0].active);
      }

      // Filtro flexible: 
      // Si 'active' es undefined (porque no vino del backend), lo contamos.
      // Si viene, debe ser estrictamente true.
      const seguimientosValidos = practice.follow_ups?.filter(s => 
        s.active === true || s.active === undefined || s.active === 1
      ) || [];

      return acc + seguimientosValidos.length;
    }, 
    0
  );

  const nombreCompleto = dashboardData.teacher 
    ? `${dashboardData.teacher.first_name} ${dashboardData.teacher.last_name}`
    : 'Cargando...';

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        <header className="contenedor-cabecera">
          <div className="bloque-saludo">
            <h1>Panel de Control - Docente</h1>
            <p>Bienvenido, {dashboardData.teacher?.first_name || 'Docente'}</p>
          </div>
        </header>

        {/* CARDS CON INFO REAL */}
        <section className="stats-grid">
          {/* Card: Estudiantes totales */}
          <StatCard
            title="Mis Estudiantes"
            value={dashboardData?.statistics?.totalStudents ?? 0}
            icon={<BookOpen size={28} />}
          />

          {/* Card: Evaluaciones realizadas */}
          <StatCard
            title="Evaluaciones Hechas"
            value={dashboardData?.statistics?.totalEvaluations ?? 0}
            icon={<ClipboardList size={28} />}
          />

          {/* Card: Rating Promedio */}
          <StatCard
            title="Rating Promedio"
            value={`${dashboardData?.statistics?.averageRating ?? '0.0'} / 5`}
            icon={<CheckCircle size={28} />}
          />
        </section>

        {/* Gráfico de Distribución por Carrera */}
        <section className="dashboard-widgets-container">
          <div className="widget-card-left">
            <div className="widget-header">
              <GraduationCap className="widget-icon career-icon" size={22} />
              <h3 className="widget-title">Estudiantes por Programa</h3>
            </div>

            <div className="career-list">
              {careerData.length > 0 ? careerData.map((career, idx) => (
                <div key={idx} className="career-item">
                  <div className="career-item-header">
                    <span>{career.name}</span>
                    <span>{career.count} ({career.percentage}%)</span>
                  </div>
                  <div className="career-bar-track">
                    <div className="career-bar-fill" style={{ width: `${career.percentage}%` }} />
                  </div>
                </div>
              )) : (
                <p className="empty-state">No hay carreras registradas.</p>
              )}
            </div>
          </div>

          {/* WIDGET 2: LISTA RÁPIDA DE ALUMNOS ASIGNADOS */}
          <div className="widget-card-right">
            <div className="widget-header">
              <UserCheck className="icon-practices" size={22} />
              <h3>Resumen de Prácticas</h3>
            </div>

            <div className="practice-list">
              {dashboardData.studentsList.length > 0 ? dashboardData.studentsList.map((item, idx) => {
                // Extraemos los valores del backend
                const evaluationsCount = item.evaluationsCount ?? 0;
                const averageRating = item.averageRating ?? '0.0';

                const isLowRating = parseFloat(averageRating) < 3.0;
                const isInactive = !item.active;
                
                // 🚨 Alerta si está inactivo O si su nota va por debajo de 3.0
                const hasAlert = isInactive || isLowRating;

                // Determinamos qué texto mostrar en la etiqueta de estado
                let badgeText = "Activo";
                if (isInactive) badgeText = "Inactivo";
                else if (isLowRating) badgeText = "Riesgo (< 3.0)";

                // Definimos la clase CSS correspondiente
                const statusClass = isInactive ? 'inactive' : (isLowRating ? 'danger' : 'active');

                return (
                  <div key={idx} className={`practice-item ${statusClass}`}>
                    <div className="practice-item-info">
                      <h4>{item.students?.first_name} {item.students?.last_name}</h4>
                      <div className="practice-item-meta">
                        <Mail size={12} />
                        <span>{item.students?.mail}</span>
                      </div>
                      <div className="practice-item-stats">
                        <span>Evaluaciones: {evaluationsCount}</span>
                        <span className={isLowRating ? "text-danger-highlight" : ""}>
                          Rating: {averageRating} / 5
                        </span>
                      </div>
                    </div>

                    {/* Badge dinámico */}
                    <span className={`practice-status-badge ${statusClass}`}>
                      {badgeText}
                    </span>
                  </div>
                );
              }) : (
                <p className="empty-state">No tienes estudiantes asignados en este periodo.</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default InicioTeacher;