import React, { useEffect, useState } from 'react';
import {
  ClipboardList,
  BookOpen,
  Building,
  Users,
  Briefcase,
  Clock,
  TrendingUp,
  Mail,
  CalendarDays,
  GraduationCap,
} from 'lucide-react';

import Sidebar from '../../components/admin/sidebar';
import StatCard from '../../components/teacher/statcard';
import '../../styles/styles-admin/inicioadmin.css';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

/* ── Gráfico de torta con conic-gradient ── */
const PieChart = ({ data }) => {
  if (!data || data.length === 0)
    return <p className="adm-empty">Sin datos disponibles</p>;

  let offset = 0;
  const stops = data
    .map((d, i) => {
      const start = offset;
      const end = offset + Number(d.percentage);
      offset = end;
      return `${COLORS[i % COLORS.length]} ${start}% ${end}%`;
    })
    .join(', ');

  return (
    <div className="adm-pie-wrapper">
      <div
        className="adm-pie-circle"
        style={{ background: `conic-gradient(${stops})` }}
        aria-hidden
      />
      <div className="adm-pie-legend">
        {data.map((d, i) => (
          <div key={i} className="adm-pie-item">
            <span
              className="adm-pie-dot"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="adm-pie-label">
              {d.name} — <strong>{d.count}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Barra de progreso genérica ── */
const BarRow = ({ label, count, percentage, colorIndex = 0, unit = '' }) => (
  <div className="adm-bar-row">
    <div className="adm-bar-meta">
      <span className="adm-bar-label">{label}</span>
      <span className="adm-bar-count">
        {count} {unit}
      </span>
    </div>
    <div className="adm-bar-track">
      <div
        className="adm-bar-fill"
        style={{
          width: `${percentage}%`,
          background: COLORS[colorIndex % COLORS.length],
        }}
      />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════ */
const InicioAdmin = () => {
  const [practices, setPractices] = useState([]);
  const [vacants, setVacants] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      try {
        const [pRes, vRes, bRes] = await Promise.all([
          fetch(`${apiUrl}/practices/allPractices`, { headers }),
          fetch(`${apiUrl}/vacants/allVacants`, { headers }),
          fetch(`${apiUrl}/businesses/allBusinesses`, { headers }),
        ]);

        const pData = pRes.ok ? await pRes.json() : [];
        const vData = vRes.ok ? await vRes.json() : [];
        const bData = bRes.ok ? await bRes.json() : [];

        setPractices(Array.isArray(pData) ? pData : []);
        setVacants(Array.isArray(vData) ? vData : []);
        setBusinesses(Array.isArray(bData) ? bData : []);
      } catch (err) {
        console.error('Error cargando dashboard admin:', err);
        setPractices([]);
        setVacants([]);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  /* ── Vacantes por empresa (top 5) ── */
  const vacantsByCompany = (() => {
    const counts = {};
    vacants.forEach((v) => {
      const name = v.businesses?.company_name ?? 'Sin empresa';
      counts[name] = (counts[name] || 0) + 1;
    });
    const max = Math.max(...Object.values(counts), 1);
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / max) * 100),
      }));
  })();

  /* ── Vacantes por modalidad (torta) ── */
  const vacantsByModality = (() => {
    const counts = {};
    vacants.forEach((v) => {
      const name = v.modalities?.name ?? 'Sin modalidad';
      counts[name] = (counts[name] || 0) + 1;
    });
    const total = vacants.length || 1;
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
    }));
  })();

  /* ── Vacantes por tiempo de dedicación (torta) ── */
  const vacantsByTime = (() => {
    const counts = {};
    vacants.forEach((v) => {
      const name = v.time_modalities?.name ?? 'Sin tiempo';
      counts[name] = (counts[name] || 0) + 1;
    });
    const total = vacants.length || 1;
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
    }));
  })();

  /* ── Empresas por sector (barras) ── */
  const companiesBySector = (() => {
    const counts = {};
    businesses.forEach((b) => {
      const name = b.sector ?? 'Sin sector';
      counts[name] = (counts[name] || 0) + 1;
    });
    const max = Math.max(...Object.values(counts), 1);
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / max) * 100),
      }));
  })();

  /* ── Últimas 6 prácticas ── */
  const recentPractices = [...practices]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 6);

  /* ── Estudiantes únicos ── */
  const uniqueStudents = new Set(practices.map((p) => p.students_id)).size;

  const fmt = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString('es-CO', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '—';

  if (loading)
    return (
      <div className="loading-container">Cargando panel administrativo...</div>
    );

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        {/* ── CABECERA ── */}
        <header className="contenedor-cabecera">
          <div className="bloque-saludo">
            <h1>Panel de Control — Admin</h1>
            <p>Resumen general del sistema de prácticas universitarias</p>
          </div>
        </header>

        {/* ── STAT CARDS ── */}
        <section className="stats-grid">
          <StatCard
            title="Prácticas Activas"
            value={practices.length}
            icon={<BookOpen size={28} />}
          />
          <StatCard
            title="Vacantes Publicadas"
            value={vacants.length}
            icon={<ClipboardList size={28} />}
          />
          <StatCard
            title="Empresas Registradas"
            value={businesses.length}
            icon={<Building size={28} />}
          />
          <StatCard
            title="Estudiantes en Práctica"
            value={uniqueStudents}
            icon={<GraduationCap size={28} />}
          />
        </section>

        {/* ── FILA 1: barras + torta modalidad ── */}
        <section className="dashboard-widgets-container-admin">
          {/* Izquierda */}
          <div className="left-widgets">

            {/* Vacantes por empresa */}
            <div className="widget-card">
              <div className="widget-header">
                <Building style={{ color: '#4f46e5' }} size={22} />
                <h3>Vacantes por Empresa (Top 5)</h3>
              </div>
              <div className="widget-body-vertical">
                {vacantsByCompany.length > 0 ? (
                  vacantsByCompany.map((item, idx) => (
                    <BarRow
                      key={idx}
                      label={item.name}
                      count={item.count}
                      percentage={item.percentage}
                      colorIndex={0}
                      unit="vacantes"
                    />
                  ))
                ) : (
                  <p className="adm-empty">No hay vacantes registradas</p>
                )}
              </div>
            </div>

            {/* Empresas por sector */}
            <div className="widget-card">
              <div className="widget-header">
                <Briefcase style={{ color: '#f59e0b' }} size={22} />
                <h3>Empresas por Sector (Top 5)</h3>
              </div>
              <div className="widget-body-vertical">
                {companiesBySector.length > 0 ? (
                  companiesBySector.map((item, idx) => (
                    <BarRow
                      key={idx}
                      label={item.name}
                      count={item.count}
                      percentage={item.percentage}
                      colorIndex={2}
                      unit="empresas"
                    />
                  ))
                ) : (
                  <p className="adm-empty">No hay empresas registradas</p>
                )}
              </div>
            </div>
          </div>

          {/* Derecha: tabla prácticas recientes */}
          <aside className="right-widgets">
            <div className="widget-card adm-widget-tall">
              <div className="widget-header">
                <TrendingUp style={{ color: '#10b981' }} size={22} />
                <h3>Prácticas Recientes</h3>
              </div>

              {recentPractices.length > 0 ? (
                <div className="adm-table-wrapper">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Estudiante</th>
                        <th>Docente</th>
                        <th>Supervisor</th>
                        <th>Inicio</th>
                        <th>Fin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPractices.map((p, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="adm-cell-name">
                              <GraduationCap size={13} className="adm-cell-icon" />
                              {p.students?.first_name} {p.students?.last_name}
                            </div>
                          </td>
                          <td>
                            {p.teachers?.first_name} {p.teachers?.last_name}
                          </td>
                          <td>
                            {p.supervisors?.first_name} {p.supervisors?.last_name}
                          </td>
                          <td>
                            <span className="adm-date-badge">{fmt(p.start_date)}</span>
                          </td>
                          <td>
                            <span className="adm-date-badge">{fmt(p.end_date)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="adm-empty">No hay prácticas registradas</p>
              )}
            </div>

            <div className="widget-card-admin">
              <div className="widget-header">
                <Briefcase style={{ color: '#10b981' }} size={22} />
                <h3>Vacantes por Modalidad</h3>
              </div>
              <div className="widget-body-vertical">
                <PieChart data={vacantsByModality} />
              </div>
            </div>

            <div className="widget-card-admin">
              <div className="widget-header">
                <Clock style={{ color: '#8b5cf6' }} size={22} />
                <h3>Vacantes por Tiempo de Dedicación</h3>
              </div>
              <div className="widget-body-vertical">
                <PieChart data={vacantsByTime} />
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default InicioAdmin;
