import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import Sidebar from '../../components/components-estudiante/sidebar';
import Navbar from '../../components/components-estudiante/navbar';
import DetalleEventoModal from './modalevaluacion';
import '../../styles/styles-estudiante/evaluaciones.css';

const formatDate = (dateString) => {
  if (!dateString) return 'Sin fecha';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC'
  });
};

const Evaluaciones = () => {
  const userObj = JSON.parse(localStorage.getItem('user_data') || '{}');
  const nombreMostrar = userObj?.first_name || 'Estudiante';
  const token = localStorage.getItem('token');

  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorFetch, setErrorFetch] = useState(null);
  const [evaluacionSeleccionada, setEvaluacionSeleccionada] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('Todas');

  useEffect(() => {
    const obtenerEvaluaciones = async () => {
      try {
        setLoading(true);
        setErrorFetch(null);

        const apiUrl = import.meta.env.VITE_API_URL;
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        const decoded = token ? jwtDecode(token) : null;
        const studentId =
          decoded?.id ||
          decoded?.userId ||
          decoded?.sub ||
          userObj?.id ||
          userObj?.usuarioId ||
          localStorage.getItem('usuarioId');

        if (!studentId) {
          throw new Error('No se pudo encontrar el ID del estudiante');
        }

        // 1. Obtener práctica del estudiante (aquí viene el supervisor)
        const practicesRes = await fetch(
          `${apiUrl}/student/students/${studentId}/practices`,
          { headers }
        );

        if (!practicesRes.ok) throw new Error('Error obteniendo prácticas');
        const practicesData = await practicesRes.json();

        const practicaId = practicesData[0]?.id;
        const TeacherPractica = practicesData[0]?.teachers;
        const nombreDocente = TeacherPractica 
          ? `${TeacherPractica.first_name || ''} ${TeacherPractica.last_name || ''}`.trim()
          : 'Tutor no asignado';

        if (!practicaId) {
          throw new Error('No se encontró una práctica asignada para este estudiante');
        }

        const response = await fetch(
          `${apiUrl}/follow-ups/evaluations/${practicaId}`,
          { method: 'GET', headers }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText || 'Error en la petición'}`);
        }

        const data = await response.json();
        const evaluacionesData = Array.isArray(data) ? data : [];

        const evaluacionesMapeadas = evaluacionesData.map((evaluacion, index) => ({
          id: evaluacion.id,
          title: evaluacion.title || `Evaluación #${index + 1}`,
          fechaStr: formatDate(evaluacion.created_at),
          descripcion: evaluacion.comment || 'Sin comentarios registrados',
          calificacion: evaluacion.rating ?? 'Sin calificar',
          estado: evaluacion.active ? 'Completado' : 'Pendiente',
          profesor: evaluacion.practices?.supervisors 
            ? `${evaluacion.practices.supervisors.first_name || ''} ${evaluacion.practices.supervisors.last_name || ''}`.trim()
            : nombreDocente, 
          raw: evaluacion,
        }));

        setEvaluaciones(evaluacionesMapeadas);

      } catch (error) {
        console.error('Error obteniendo evaluaciones:', error.message);
        setErrorFetch(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) obtenerEvaluaciones();
  }, [token]);

  const evaluacionesFiltradas = evaluaciones.filter((evaluacion) => {
    if (filtroEstado === 'Todas') return true;
    return evaluacion.estado === filtroEstado;
  });

  return (
    <div className="evaluaciones-layout">
      <Sidebar />

      <main className="evaluaciones-main">
        <Navbar nombreMostrar={nombreMostrar} />

        <section className="evaluaciones-header">
          <div>
            <h2>Mis Evaluaciones</h2>
            <p>Revisa el historial y detalle de las evaluaciones registradas en tus prácticas.</p>
          </div>
        </section>

        <section className="evaluaciones-events">
          <div className="evaluaciones-events-header">
            <h3>Listado de Evaluaciones</h3>
          </div>

          <div className="table-container">
            {loading ? (
              <p>Cargando evaluaciones...</p>
            ) : errorFetch ? (
              <div><strong>Error al cargar los datos:</strong> {errorFetch}</div>
            ) : evaluacionesFiltradas.length === 0 ? (
              <p>No hay evaluaciones registradas para mostrar.</p>
            ) : (
              <table className="evaluaciones-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Calificación</th>
                    <th>Profesor</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluacionesFiltradas.map((evaluacion) => (
                    <tr key={evaluacion.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle size={18} color="#10b981" />
                          <strong>{evaluacion.title}</strong>
                        </div>
                      </td>
                      <td>
                        <span className={`estado ${evaluacion.estado.toLowerCase()}`}>
                          {evaluacion.estado}
                        </span>
                      </td>
                      <td>{evaluacion.fechaStr}</td>
                      <td>{evaluacion.calificacion}</td>
                      <td>{evaluacion.profesor}</td>
                      <td>
                        <button 
                          className="btn-primary" 
                          onClick={() => setEvaluacionSeleccionada(evaluacion)}
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {evaluacionSeleccionada && (
          <DetalleEventoModal 
            evento={evaluacionSeleccionada} 
            onClose={() => setEvaluacionSeleccionada(null)} 
          />
        )}
        
      </main>
    </div>
  );
};

export default Evaluaciones;