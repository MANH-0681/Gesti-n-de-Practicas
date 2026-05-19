import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, BookOpen, FileText, Briefcase, UserCheck } from 'lucide-react';
import Sidebar from '../../components/components-estudiante/sidebar';
import Navbar from '../../components/components-estudiante/navbar';
import StatCard from '../../components/components-estudiante/statcard';

import '../../styles/styles-estudiante/perfil.css';

const Perfil = () => {
  const [student, setStudent] = useState(null);
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState({});

  // Decodificador de JWT simplificado
  const decodeJWT = (token) => {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    } catch {
      return null;
    }
  };

  const fetchProfileData = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    const token = localStorage.getItem('token');
    const userObj = JSON.parse(localStorage.getItem('user') || '{}');

    const decoded = token ? decodeJWT(token) : null;

    const studentId =
      decoded?.id ||
      decoded?.userId ||
      decoded?.sub ||
      userObj?.id ||
      userObj?.usuarioId ||
      localStorage.getItem('usuarioId');

    if (!studentId) {
      setError('Sesión inválida. Por favor, inicia sesión de nuevo.');
      setLoading(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    try {
      const [studentRes, practicesRes] = await Promise.all([
        fetch(`${apiUrl}/student/students/${studentId}`, { headers }),
        fetch(`${apiUrl}/student/students/${studentId}/practices`, { headers })
      ]);

      if (studentRes.ok) {
        const studentData = await studentRes.json();
        setStudent(studentData);
        console.log('Perfil recargado:', studentData);
      } else {
        setStudent({
          first_name: userObj.first_name || 'Estudiante',
          last_name: userObj.last_name || '',
          document_number: userObj.document_number || 'N/A',
          mail: userObj.email || localStorage.getItem('user_email') || 'N/A',
          cell_phone: userObj.cell_phone || 'N/A',
          address: userObj.address || 'N/A',
          semester: userObj.semester || 'N/A',
          careers: { name: 'No disponible' }
        });
      }

      if (practicesRes.ok) {
        const practicesData = await practicesRes.json();
        setPractices(practicesData);
      }

    } catch (err) {
      console.error(err);
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleSave = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const token = localStorage.getItem('token') || '';
  const userObj = JSON.parse(localStorage.getItem('user') || '{}');
  const decoded = token ? decodeJWT(token) : null;

  const studentId =
    student?.id ??
    student?.students_id ??
    decoded?.id ??
    decoded?.userId ??
    decoded?.sub ??
    userObj?.id ??
    userObj?.usuarioId ??
    localStorage.getItem('usuarioId');

  if (!studentId) {
    alert('Error: No se pudo identificar al usuario.');
    return;
  }

  const updateData = {
    first_name: editedStudent?.first_name ?? student?.first_name ?? '',
    middle_name: editedStudent?.middle_name ?? student?.middle_name ?? '',
    last_name: editedStudent?.last_name ?? student?.last_name ?? '',
    second_last_name: editedStudent?.second_last_name ?? student?.second_last_name ?? '',
    document_number: editedStudent?.document_number ?? student?.document_number ?? '',
    mail: editedStudent?.mail ?? student?.mail ?? '',
    cell_phone: editedStudent?.cell_phone ?? student?.cell_phone ?? '',
    address: editedStudent?.address ?? student?.address ?? ''
  };

  try {
    console.log('Iniciando guardado...');
    console.log('PUT', `${apiUrl}/student/students/${studentId}`, updateData);

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    console.log('Headers:', headers);

    // Crear AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

    const res = await fetch(`${apiUrl}/student/students/${studentId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log('Respuesta recibida, status:', res.status);

    const text = await res.text();
    console.log('Texto de respuesta:', text);

    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
        console.log('Datos parseados:', data);
      } catch (parseErr) {
        console.warn('Respuesta no JSON:', text);
        data = { raw: text };
      }
    }

    if (res.ok) {
      console.log('Éxito en la solicitud');
      
      // Actualizar el estado directamente con los datos enviados
      setStudent(prev => ({
        ...prev,
        ...updateData
      }));
      
      console.log('Estado actualizado');
      
      setIsEditing(false);
      setEditedStudent({}); 
      
      console.log('Alert a mostrar');
      alert('¡Perfil actualizado con éxito!');
    } else {
      console.error('Error en la solicitud:', res.status, data);
      if (res.status === 401) {
        alert('No autorizado. Por favor inicia sesión de nuevo.');
      } else {
        alert(data?.error ?? data?.message ?? `Error al actualizar (status ${res.status})`);
      }
    }
  } catch (err) {
    console.error('Error en el try-catch:', err);
    console.error('Stack:', err.stack);
    if (err.name === 'AbortError') {
      alert('Tiempo de espera agotado. El servidor no responde.');
    } else {
      alert('Error de conexión al intentar guardar: ' + err.message);
    }
  }
};


  if (loading) return <div className="loading-state">Cargando perfil...</div>;
  if (error) return <div className="error-state">{error}</div>;

  const nombreMostrar = student?.first_name || 'Estudiante';

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Navbar nombreMostrar={nombreMostrar} />

        <div className="profile-container">

          <div className="stats-grid">
            <StatCard title="Programa" value={student?.careers?.name || 'N/A'} icon={<BookOpen size={24} />} />
            <StatCard title="Semestre" value={`${student?.semester || 'N/A'}°`} icon={<FileText size={24} />} />
            <StatCard title="Prácticas" value={practices.length.toString()} icon={<Briefcase size={24} />} />
          </div>

          <div className="profile-content-grid-estudiante">
            <section className="profile-card">
              <h3>Información Personal</h3>

              <div className="button-group">
               <button
                  onClick={() => {
                      if (isEditing) {
                        setIsEditing(false);
                        setEditedStudent({});
                      } else {
                        setIsEditing(true);
                        // Copiamos el estado actual al estado de edición
                        setEditedStudent({ ...student });
                      }
                    }}
                  >
                    {isEditing ? 'Cancelar' : 'Editar'}
                </button>
                {isEditing && (
                  <button onClick={handleSave}>
                    Guardar
                  </button>
                )}
              </div>

              <div className="info-list">
                
                <div className="info-item">
                  <strong>Nombres:</strong>
                  {isEditing ? (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <input
                        placeholder="Primer Nombre"
                        value={editedStudent.first_name || ''}
                        onChange={(e) => setEditedStudent({ ...editedStudent, first_name: e.target.value })}
                      />
                      <input
                        placeholder="Segundo Nombre"
                        value={editedStudent.middle_name || ''}
                        onChange={(e) => setEditedStudent({ ...editedStudent, middle_name: e.target.value })}
                      />
                    </div>
                  ) : (
                    <span>{`${student?.first_name || ''} ${student?.middle_name || ''}`.trim()}</span>
                  )}
                </div>

                <div className="info-item">
                  <strong>Apellidos:</strong>
                  {isEditing ? (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <input
                        placeholder="Primer Apellido"
                        value={editedStudent.last_name || ''}
                        onChange={(e) => setEditedStudent({ ...editedStudent, last_name: e.target.value })}
                      />
                      <input
                        placeholder="Segundo Apellido"
                        value={editedStudent.second_last_name || ''}
                        onChange={(e) => setEditedStudent({ ...editedStudent, second_last_name: e.target.value })}
                      />
                    </div>
                  ) : (
                    <span>{`${student?.last_name || ''} ${student?.second_last_name || ''}`.trim()}</span>
                  )}
                </div>
{/*}
                <div className="info-item">
                  <strong>Documento:</strong>
                  {isEditing ? (
                    <input
                      value={editedStudent.document_number || ''}
                      onChange={(e) => setEditedStudent({ ...editedStudent, document_number: e.target.value })}
                    />
                  ) : (
                    <span>{student?.document_number}</span>
                  )}
                </div>
*/}
                <div className="info-item">
                  <Mail size={16} />
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedStudent.mail || ''}
                      onChange={(e) => setEditedStudent({ ...editedStudent, mail: e.target.value })}
                    />
                  ) : (
                    <span>{student?.mail}</span>
                  )}
                </div>

                <div className="info-item">
                  <Phone size={16} />
                  {isEditing ? (
                    <input
                      value={editedStudent.cell_phone || ''}
                      onChange={(e) => setEditedStudent({ ...editedStudent, cell_phone: e.target.value })}
                    />
                  ) : (
                    <span>{student?.cell_phone}</span>
                  )}
                </div>

                <div className="info-item">
                  <MapPin size={16} />
                  {isEditing ? (
                    <input
                      value={editedStudent.address || ''}
                      onChange={(e) => setEditedStudent({ ...editedStudent, address: e.target.value })}
                    />
                  ) : (
                    <span>{student?.address}</span>
                  )}
                </div>

              </div>
            </section>

            <section className="profile-card">
              <h3>Mis Prácticas</h3>
              {practices.length === 0 ? (
                <p className="no-data">No hay prácticas registradas.</p>
              ) : (
                <div className="practices-list">
                  {practices.map((p) => (
                    <div key={p.id} className="practice-card">
                      <h4>{p.vacants?.title}</h4>
                      <span className="modality-badge">{p.vacants?.modalities?.name}</span>
                      <div className="practice-details">
                        <div className="detail-item">
                          <UserCheck size={16} />
                          <div>
                            <strong>Tutor:</strong>
                            <p>{p.teachers?.first_name} {p.teachers?.last_name}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Perfil;