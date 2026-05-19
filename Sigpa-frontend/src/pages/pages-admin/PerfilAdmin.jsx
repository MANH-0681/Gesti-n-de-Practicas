import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, MapPin, Briefcase, Users, Award, Clock,
  Building2, Globe, User, FileText
} from 'lucide-react';
import Sidebar from '../../components/admin/sidebar';
import StatCard from '../../components/teacher/statcard';
import '../../styles/styles-admin/perfiladmin.css'; 

const PerfilAdmin = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeacher, setEditedTeacher] = useState({});

  const decodeJWT = (token) => {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    } catch { return null; }
  };

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/teachers/dashboard-data`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Error al cargar el perfil del administrador:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfileData(); }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('token') || '';
    const decoded = token ? decodeJWT(token) : null;
    const teacher = data?.teacher;

    const teacherId =
      teacher?.id ??
      decoded?.id ??
      decoded?.userId ??
      decoded?.sub;

    if (!teacherId) {
      alert('Error: No se pudo identificar al usuario.');
      return;
    }

    const updateData = {
      first_name:        editedTeacher?.first_name        ?? teacher?.first_name        ?? '',
      middle_name:       editedTeacher?.middle_name       ?? teacher?.middle_name       ?? '',
      last_name:         editedTeacher?.last_name         ?? teacher?.last_name         ?? '',
      second_last_name:  editedTeacher?.second_last_name  ?? teacher?.second_last_name  ?? '',
      document_number:   editedTeacher?.document_number   ?? teacher?.document_number   ?? '',
      mail:              editedTeacher?.mail              ?? teacher?.mail              ?? '',
      cell_phone:        editedTeacher?.cell_phone        ?? teacher?.cell_phone        ?? '',
      address:           editedTeacher?.address           ?? teacher?.address           ?? '',
      speciality:        editedTeacher?.speciality        ?? teacher?.speciality        ?? '',
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/teachers/updateTeacher/${teacherId}`, {
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
        setData(prev => ({
          ...prev,
          teacher: { ...prev.teacher, ...updateData }
        }));
        setIsEditing(false);
        setEditedTeacher({});
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

  if (loading) return <div className="loading-container">Cargando perfil...</div>;

  const teacher = data?.teacher;
  const university = teacher?.universities;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="contenedor-cabecera">
          <div className="bloque-saludo">
            <h1>
              Hola, <span className="company-name-highlight">
                {teacher?.first_name || 'Administrador'}
              </span> 👋
            </h1>
          </div>
        </header>

        <div className="profile-content-grid-admin">

          {/* INFORMACIÓN PERSONAL */}
          <section className="profile-card">
            <h3><User size={20} /> Información Personal</h3>

            <div className="button-group">
              <button onClick={() => {
                if (isEditing) { setIsEditing(false); setEditedTeacher({}); }
                else { setIsEditing(true); setEditedTeacher({ ...teacher }); }
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
                    <input placeholder="Primer Nombre"  value={editedTeacher.first_name  || ''} onChange={(e) => setEditedTeacher({ ...editedTeacher, first_name:  e.target.value })} />
                    <input placeholder="Segundo Nombre" value={editedTeacher.middle_name || ''} onChange={(e) => setEditedTeacher({ ...editedTeacher, middle_name: e.target.value })} />
                  </div>
                ) : (
                  <span>{`${teacher?.first_name || ''} ${teacher?.middle_name || ''}`.trim()}</span>
                )}
              </div>

              <div className="info-item">
                <User size={16} />
                <strong>Apellidos:</strong>
                {isEditing ? (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input placeholder="Primer Apellido"  value={editedTeacher.last_name        || ''} onChange={(e) => setEditedTeacher({ ...editedTeacher, last_name:        e.target.value })} />
                    <input placeholder="Segundo Apellido" value={editedTeacher.second_last_name || ''} onChange={(e) => setEditedTeacher({ ...editedTeacher, second_last_name: e.target.value })} />
                  </div>
                ) : (
                  <span>{`${teacher?.last_name || ''} ${teacher?.second_last_name || ''}`.trim()}</span>
                )}
              </div>

              <div className="info-item">
                <FileText size={16} />
                <strong>Documento:</strong>
                {isEditing ? (
                  <input value={editedTeacher.document_number || ''} onChange={(e) => setEditedTeacher({ ...editedTeacher, document_number: e.target.value })} />
                ) : (
                  <span>{teacher?.document_number || 'N/A'}</span>
                )}
              </div>

              <div className="info-item">
                <Briefcase size={16} />
                <strong>Especialidad:</strong>
                {isEditing ? (
                  <input value={editedTeacher.speciality || ''} onChange={(e) => setEditedTeacher({ ...editedTeacher, speciality: e.target.value })} />
                ) : (
                  <span>{teacher?.speciality || 'N/A'}</span>
                )}
              </div>

              <div className="info-item">
                <Mail size={16} />
                <strong>Correo:</strong>
                {isEditing ? (
                  <input type="email" value={editedTeacher.mail || ''} onChange={(e) => setEditedTeacher({ ...editedTeacher, mail: e.target.value })} />
                ) : (
                  <span>{teacher?.mail || 'N/A'}</span>
                )}
              </div>

              <div className="info-item">
                <Phone size={16} />
                <strong>Teléfono:</strong>
                {isEditing ? (
                  <input value={editedTeacher.cell_phone || ''} onChange={(e) => setEditedTeacher({ ...editedTeacher, cell_phone: e.target.value })} />
                ) : (
                  <span>{teacher?.cell_phone || 'N/A'}</span>
                )}
              </div>

              <div className="info-item">
                <MapPin size={16} />
                <strong>Dirección:</strong>
                {isEditing ? (
                  <input value={editedTeacher.address || ''} onChange={(e) => setEditedTeacher({ ...editedTeacher, address: e.target.value })} />
                ) : (
                  <span>{teacher?.address || 'N/A'}</span>
                )}
              </div>

            </div>
          </section>

          {/* INFORMACIÓN DE LA UNIVERSIDAD (solo lectura) */}
          <section className="profile-card">
            <h3>Información de la Universidad</h3>
            <div className="info-list">
              <div className="info-item"><Building2 size={16} /><strong>Nombre:</strong>    <span>{university?.name              || 'No asignada'}</span></div>
              <div className="info-item"><FileText  size={16} /><strong>Acrónimo:</strong>  <span>{university?.acronym            || 'N/A'}</span></div>
              <div className="info-item"><MapPin    size={16} /><strong>Dirección:</strong> <span>{university?.address            || 'N/A'}</span></div>
              <div className="info-item"><Phone     size={16} /><strong>Teléfono:</strong>  <span>{university?.cell_phone         || 'N/A'}</span></div>
              <div className="info-item"><Mail      size={16} /><strong>Mail:</strong>       <span>{university?.institutional_mail || 'N/A'}</span></div>
              <div className="info-item"><MapPin    size={16} /><strong>Ciudad:</strong>    <span>{university?.city               || 'N/A'}</span></div>
              <div className="info-item"><Globe     size={16} /><strong>País:</strong>      <span>{university?.country            || 'N/A'}</span></div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default PerfilAdmin;
