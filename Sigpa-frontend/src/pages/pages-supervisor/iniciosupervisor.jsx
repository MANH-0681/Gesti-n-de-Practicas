import React, { useEffect, useState } from 'react';
import { 
  Users, 
  ClipboardList,
  Clock, 
  TrendingUp, 
  Mail, 
  Briefcase 
} from 'lucide-react';

import Sidebar from '../../components/supervisor/sidebar';
import StatCard from '../../components/supervisor/statcard';
import '../../styles/styles-supervisor/inicio.css';

const InicioSupervisor = () => {
  const [dashboardData, setDashboardData] = useState({
    supervisor: null,
    statistics: {
      totalStudents: 0,
      activePractices: 0,
      pendingFollowUps: 0,
      totalFollowUps: 0,
    },
    studentsList: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem('token');

        const response = await fetch(`${apiUrl}/supervisors/dashboard-data`, {
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
        console.error("Error al cargar el dashboard del supervisor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cálculo de seguimientos válidos
  const totalSeguimientosRealizados = dashboardData.studentsList.reduce((acc, practice) => {
    const seguimientosValidos = practice.follow_ups?.filter(s =>
      s.active === true || s.active === undefined || s.active === 1
    ) || [];
    return acc + seguimientosValidos.length;
  }, 0);

  // Progreso de una práctica individual
  const calculateProgress = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate).getTime();
    const end   = new Date(endDate).getTime();
    const today = new Date().getTime();
    if (today < start) return 0;
    if (today >= end)  return 100;
    return Math.round(((today - start) / (end - start)) * 100);
  };

  // Distribución por modalidad de espacio (Remoto / Presencial / Híbrido)
  const getModalityDistribution = () => {
    const counts = {};
    dashboardData.studentsList.forEach(item => {
      const name = item.vacants?.modalities?.name ?? 'Sin modalidad';
      counts[name] = (counts[name] || 0) + 1;
    });
    const total = dashboardData.studentsList.length || 1;
    return Object.keys(counts).map(name => ({
      name,
      count: counts[name],
      percentage: ((counts[name] / total) * 100).toFixed(0)
    }));
  };

  // Distribución por modalidad de tiempo (Tiempo Completo / Medio Tiempo / 6 horas)
  const getTimeModalityDistribution = () => {
    const counts = {};
    dashboardData.studentsList.forEach(item => {
      const name = item.vacants?.time_modalities?.name ?? 'Sin tiempo';
      counts[name] = (counts[name] || 0) + 1;
    });
    const total = dashboardData.studentsList.length || 1;
    return Object.keys(counts).map(name => ({
      name,
      count: counts[name],
      percentage: ((counts[name] / total) * 100).toFixed(0)
    }));
  };

  const modalityData    = getModalityDistribution();
  const timeModalityData = getTimeModalityDistribution();

  // Gráfico de torta con conic-gradient (sin dependencias extra)
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

  const PieChart = ({ data, size = 140 }) => {
    if (!data || data.length === 0) return <div className="empty-state">Sin datos</div>;

    let offset = 0;
    const stops = data.map((d, i) => {
      const start = offset;
      const end   = offset + Number(d.percentage);
      offset = end;
      return `${COLORS[i % COLORS.length]} ${start}% ${end}%`;
    }).join(', ');

    return (
      <div className="pie-chart-wrapper">
        {/* Círculo */}
        <div
          className="pie-chart-circle"
          style={{ background: `conic-gradient(${stops})` }}
          aria-hidden
        />
        {/* Leyenda */}
        <div className="pie-chart-legend">
          {data.map((d, i) => (
            <div key={i} className="pie-chart-legend-item">
              <span
                className="pie-chart-legend-dot"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="pie-chart-legend-label">
                {d.name} — <strong>{d.count}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Progreso global promedio
  const globalAverageProgress = (() => {
    if (dashboardData.studentsList.length === 0) return 0;
    const total = dashboardData.studentsList.reduce(
      (sum, item) => sum + calculateProgress(item.start_date, item.end_date), 0
    );
    return Math.round(total / dashboardData.studentsList.length);
  })();

  if (loading) {
    return <div className="loading-container">Cargando panel de supervisión corporativa...</div>;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">

        {/* ── CABECERA ── */}
        <header className="contenedor-cabecera">
          <div className="bloque-saludo">
            <h1>Panel de Supervisión</h1>
            <p>Bienvenido, <span className="company-name-highlight">
              {dashboardData.supervisor?.first_name || 'Supervisor'}
            </span></p>
          </div>
        </header>

        {/* ── STAT CARDS ── */}
        <section className="stats-grid">
          <StatCard title="Seguimientos"        value={totalSeguimientosRealizados}             icon={<ClipboardList size={28} />} />
          <StatCard title="Prácticas Activas"   value={dashboardData.statistics.activePractices} icon={<Clock size={28} />} />
          <StatCard title="Practicantes a cargo" value={dashboardData.statistics.totalStudents}  icon={<Users size={28} />} />
          <StatCard title="Progreso General"    value={`${globalAverageProgress}%`}              icon={<TrendingUp size={28} />} />
        </section>

        {/* ── WIDGETS ── */}
        <section className="dashboard-widgets-container">

          {/* ── IZQUIERDA ── */}
          <div className="left-widgets">

            {/* WIDGET BARRAS: Distribución de Espacios */}
            <div className="widget-card widget-spaces">
              <div className="widget-header">
                <Briefcase style={{ color: '#4f46e5' }} size={22} />
                <h3>Modalidad</h3>
              </div>

              <div className="widget-body-vertical">
                {modalityData.length > 0 ? modalityData.map((modality, idx) => (
                  <div key={idx} className="career-item">
                    <div className="career-item-header">
                      <span className="bar-label">{modality.name}</span>
                      <span className="bar-count">{modality.count} pasantes</span>
                    </div>
                    <div className="career-bar-track">
                      <div className="career-bar-fill" style={{ width: `${modality.percentage}%` }} />
                    </div>
                  </div>
                )) : (
                  <p className="empty-state">No hay datos de modalidades disponibles.</p>
                )}
              </div>
            </div>

            {/* WIDGET TORTA: Modalidades por Tiempo */}
            <div className="widget-card widget-time">
              <div className="widget-header">
                <Clock style={{ color: '#10b981' }} size={22} />
                <h3>Modalidades por Tiempo</h3>
              </div>

              <div className="widget-body-vertical">
                {timeModalityData.length > 0
                  ? <PieChart data={timeModalityData} />
                  : <p className="empty-state">No hay datos de modalidades por tiempo disponibles.</p>
                }
              </div>
            </div>

          </div>

          {/* ── DERECHA: Lista de avance ── */}
          <aside className="right-widgets">
            <div className="widget-card widget-right">
              <div className="widget-header">
                <TrendingUp style={{ color: '#10b981' }} size={22} />
                <h3>Estado de Avance del Proyecto</h3>
              </div>

              <div className="practice-list">
                {dashboardData.studentsList.length > 0 ? dashboardData.studentsList.map((item, idx) => {
                  const progress    = calculateProgress(item.start_date, item.end_date);
                  const isStuck     = progress < 25;
                  const completed   = progress >= 100;
                  const statusText  = completed ? 'Completado' : isStuck ? 'Progreso Bajo' : 'En Ejecución';
                  const barColor    = isStuck
                    ? 'linear-gradient(90deg, #ef4444, #f87171)'
                    : 'linear-gradient(90deg, #10b981, #34d399)';

                  return (
                    <div key={idx} className={`practice-item ${isStuck ? 'danger' : 'active'}`}>
                      <div className="practice-item-info" style={{ width: '100%' }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <h4>{item.students?.first_name} {item.students?.last_name}</h4>
                          <span className={`practice-status-badge ${isStuck ? 'danger' : 'active'}`}>
                            {statusText}
                          </span>
                        </div>

                        <div className="practice-item-meta">
                          <Mail size={12} />
                          <span>{item.students?.mail}</span>
                        </div>

                        <div style={{ marginTop: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px', color: '#64748b' }}>
                            <span>Progreso del periodo de práctica</span>
                            <span style={{ fontWeight: 'bold', color: isStuck ? '#ef4444' : '#10b981' }}>{progress}%</span>
                          </div>
                          <div className="career-bar-track">
                            <div className="career-bar-fill" style={{ width: `${progress}%`, background: barColor }} />
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                }) : (
                  <p className="empty-state">No hay pasantes activos vinculados a su cuenta corporativa.</p>
                )}
              </div>
            </div>
          </aside>

        </section>
      </main>
    </div>
  );
};

export default InicioSupervisor;
