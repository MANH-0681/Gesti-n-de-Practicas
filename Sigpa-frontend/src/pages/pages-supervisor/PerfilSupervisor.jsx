import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, MapPin, Briefcase, Users, Award,
  Building2, ShieldCheck, Globe, User, FileText,
  TrendingUp, ClipboardList, Clock
} from 'lucide-react';
import Sidebar from '../../components/supervisor/sidebar';
import StatCard from '../../components/supervisor/statcard';
import '../../styles/styles-supervisor/PerfilSupervisor.css';

const PerfilSupervisor = () => {
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedSupervisor, setEditedSupervisor] = useState({});

  const decodeJWT = (token) => {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    } catch { return null; }
  };

  // Igual que en InicioSupervisor
  const calculateProgress = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate).getTime();
    const end   = new Date(endDate).getTime();
    const today = new Date().getTime();
    if (today < start) return 0;
    if (today >= end)  return 100;
    return Math.round(((today - start) / (end - start)) * 100);
  };

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/supervisors/dashboard-data`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const result = await response.json();
        setDashboardData(result); // misma estructura que InicioSupervisor
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfileData(); }, []);

  // Igual que en InicioSupervisor
  const totalSeguimientosRealizados = dashboardData.studentsList.reduce((acc, practice) => {
    const seguimientosValidos = practice.follow_ups?.filter(s =>
      s.active === true || s.active === undefined || s.active === 1
    ) || [];
    return acc + seguimientosValidos.length;
  }, 0);

  const globalAverageProgress = (() => {
    if (dashboardData.studentsList.length === 0) return 0;
    const total = dashboardData.studentsList.reduce(
      (sum, item) => sum + calculateProgress(item.start_date, item.end_date), 0
    );
    return Math.round(total / dashboardData.studentsList.length);
  })();

  const handleSave = async () => {
    const token = localStorage.getItem('token') || '';
    const decoded = token ? decodeJWT(token) : null;
    const supervisor = dashboardData.supervisor;

    const supervisorId =
      supervisor?.id ??
      decoded?.id ??
      decoded?.userId ??
      decoded?.sub;

    if (!supervisorId) {
      alert('Error: No se pudo identificar al usuario.');
      return;
    }

    const updateData = {
      first_name:       editedSupervisor?.first_name       ?? supervisor?.first_name       ?? '',
      middle_name:      editedSupervisor?.middle_name      ?? supervisor?.middle_name      ?? '',
      last_name:        editedSupervisor?.last_name        ?? supervisor?.last_name        ?? '',
      second_last_name: editedSupervisor?.second_last_name ?? supervisor?.second_last_name ?? '',
      document_number:  editedSupervisor?.document_number  ?? supervisor?.document_number  ?? '',
      mail:             editedSupervisor?.mail             ?? supervisor?.mail             ?? '',
      cell_phone:       editedSupervisor?.cell_phone       ?? supervisor?.cell_phone       ?? '',
      position:         editedSupervisor?.position         ?? supervisor?.position         ?? '',
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/supervisors/updateSupervisor/${supervisorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const text = await res.text();
      let resData = {};
      if (text) {
        try { resData = JSON.parse(text); } catch { resData = { raw: text }; }
      }

      if (res.ok) {
        setDashboardData(prev => ({
          ...prev,
          supervisor: { ...prev.supervisor, ...updateData }
        }));
        setIsEditing(false);
        setEditedSupervisor({});
        alert('¡Perfil actualizado con éxito!');
      } else {
        if (res.status === 401) {
          alert('No autorizado. Por favor inicia sesión de nuevo.');
        } else {
          alert(resData?.error ?? resData?.message ?? `Error al actualizar (status ${res.status})`);
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        alert('Tiempo de espera agotado. El servidor no responde.');
      } else {
        alert('Error de conexión al intentar guardar: ' + err.message);
      }
    }
  };

  if (loading) return <div className="loading-screen">Cargando...</div>;

  const supervisor = dashboardData.supervisor;
  const business   = supervisor?.businesses?.[0] || supervisor?.businesses;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="contenedor-cabecera">
          <div className="bloque-saludo">
            <h1>
              Hola, <span className="company-name-highlight">
                {supervisor?.first_name || 'Supervisor'}
              </span> 👋
            </h1>
          </div>
        </header>

        <div className="profile-container">

          {/* STAT CARDS — mismos valores que InicioSupervisor */}
          <section className="stats-grid">
            <StatCard title="Seguimientos"         value={totalSeguimientosRealizados}               icon={<ClipboardList size={28} />} />
            <StatCard title="Prácticas Activas"    value={dashboardData.statistics.activePractices}  icon={<Clock         size={28} />} />
            <StatCard title="Practicantes a cargo" value={dashboardData.statistics.totalStudents}    icon={<Users         size={28} />} />
            <StatCard title="Progreso General"     value={`${globalAverageProgress}%`}               icon={<TrendingUp    size={28} />} />
          </section>

          <div className="profile-content-grid-supervisor">

            {/* INFORMACIÓN PERSONAL */}
            <section className="profile-card">
              <h3>Información Personal</h3>

              <div className="button-group">
                <button onClick={() => {
                  if (isEditing) { setIsEditing(false); setEditedSupervisor({}); }
                  else { setIsEditing(true); setEditedSupervisor({ ...supervisor }); }
                }}>
                  {isEditing ? 'Cancelar' : 'Editar'}
                </button>
                {isEditing && <button onClick={handleSave}>Guardar</button>}
              </div>

              <div className="info-list">

                <div className="info-item">
                  <User size={16} />
                  <strong>Nombres:</strong>
                  {isEditing ? (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <input placeholder="Primer Nombre"  value={editedSupervisor.first_name  || ''} onChange={(e) => setEditedSupervisor({ ...editedSupervisor, first_name:  e.target.value })} />
                      <input placeholder="Segundo Nombre" value={editedSupervisor.middle_name || ''} onChange={(e) => setEditedSupervisor({ ...editedSupervisor, middle_name: e.target.value })} />
                    </div>
                  ) : (
                    <span>{`${supervisor?.first_name || ''} ${supervisor?.middle_name || ''}`.trim()}</span>
                  )}
                </div>

                <div className="info-item">
                  <User size={16} />
                  <strong>Apellidos:</strong>
                  {isEditing ? (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <input placeholder="Primer Apellido"  value={editedSupervisor.last_name        || ''} onChange={(e) => setEditedSupervisor({ ...editedSupervisor, last_name:        e.target.value })} />
                      <input placeholder="Segundo Apellido" value={editedSupervisor.second_last_name || ''} onChange={(e) => setEditedSupervisor({ ...editedSupervisor, second_last_name: e.target.value })} />
                    </div>
                  ) : (
                    <span>{`${supervisor?.last_name || ''} ${supervisor?.second_last_name || ''}`.trim()}</span>
                  )}
                </div>

                <div className="info-item">
                  <ShieldCheck size={16} />
                  <strong>Documento:</strong>
                  {isEditing ? (
                    <input value={editedSupervisor.document_number || ''} onChange={(e) => setEditedSupervisor({ ...editedSupervisor, document_number: e.target.value })} />
                  ) : (
                    <span>{supervisor?.document_number || 'N/A'}</span>
                  )}
                </div>

                <div className="info-item">
                  <Mail size={16} />
                  <strong>Correo:</strong>
                  {isEditing ? (
                    <input type="email" value={editedSupervisor.mail || ''} onChange={(e) => setEditedSupervisor({ ...editedSupervisor, mail: e.target.value })} />
                  ) : (
                    <span>{supervisor?.mail || 'N/A'}</span>
                  )}
                </div>

                <div className="info-item">
                  <Phone size={16} />
                  <strong>Teléfono:</strong>
                  {isEditing ? (
                    <input value={editedSupervisor.cell_phone || ''} onChange={(e) => setEditedSupervisor({ ...editedSupervisor, cell_phone: e.target.value })} />
                  ) : (
                    <span>{supervisor?.cell_phone || 'N/A'}</span>
                  )}
                </div>

                <div className="info-item">
                  <Briefcase size={16} />
                  <strong>Cargo:</strong>
                  {isEditing ? (
                    <input value={editedSupervisor.position || ''} onChange={(e) => setEditedSupervisor({ ...editedSupervisor, position: e.target.value })} />
                  ) : (
                    <span>{supervisor?.position || 'N/A'}</span>
                  )}
                </div>

              </div>
            </section>

            {/* INFORMACIÓN DE LA EMPRESA (solo lectura) */}
            <section className="profile-card">
              <h3>Información de la Empresa</h3>
              <div className="info-list">
                <div className="info-item"><Building2 size={16} /><strong>Nombre:</strong>    <span>{business?.company_name || 'N/A'}</span></div>
                <div className="info-item"><FileText  size={16} /><strong>NIT:</strong>        <span>{business?.nit         || 'N/A'}</span></div>
                <div className="info-item"><MapPin    size={16} /><strong>Dirección:</strong> <span>{business?.address     || 'N/A'}</span></div>
                <div className="info-item"><Phone     size={16} /><strong>Teléfono:</strong>  <span>{business?.cell_phone  || 'N/A'}</span></div>
                <div className="info-item"><Mail      size={16} /><strong>Mail:</strong>       <span>{business?.mail        || 'N/A'}</span></div>
                <div className="info-item"><MapPin    size={16} /><strong>Ciudad:</strong>    <span>{business?.city        || 'N/A'}</span></div>
                <div className="info-item"><Briefcase size={16} /><strong>Sector:</strong>    <span>{business?.sector      || 'N/A'}</span></div>
                <div className="info-item"><Globe     size={16} /><strong>Website:</strong>   <span>{business?.website     || 'N/A'}</span></div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default PerfilSupervisor;
