import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import esLocale from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Sidebar from '../../components/components-estudiante/sidebar';
import Navbar from '../../components/components-estudiante/navbar';
import DetalleEventoModal from './modalAgenda';
import '../../styles/styles-estudiante/agenda.css';

const locales = {
  'es': esLocale,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

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

const Agenda = () => {
  const nombre = localStorage.getItem('user_name') || 'Estudiante';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');
  const [eventos, setEventos] = useState([]);
  const [pendientesLocales, setPendientesLocales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorFetch, setErrorFetch] = useState(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  const token = localStorage.getItem('token');
  const userObj = JSON.parse(localStorage.getItem('user_data') || '{}');
  const decoded = token ? jwtDecode(token) : null;

  const studentId =
    decoded?.id ||
    decoded?.userId ||
    decoded?.sub ||
    userObj?.id ||
    userObj?.usuarioId ||
    localStorage.getItem('usuarioId');

  useEffect(() => {
    const obtenerSeguimientos = async () => {
      try {
        setLoading(true);
        setErrorFetch(null);

        const apiUrl = import.meta.env.VITE_API_URL;
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        const practicesRes = await fetch(`${apiUrl}/student/students/${studentId}/practices`, { headers });
        if (!practicesRes.ok) throw new Error('Error obteniendo prácticas');
        
        const practicesData = await practicesRes.json();
        const practicaId = practicesData[0]?.id;

        if (!practicaId) throw new Error('No se encontró una práctica asignada');

        const response = await fetch(`${apiUrl}/follow-ups/seguimientos/${practicaId}`, { method: 'GET', headers });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText || 'Error en la petición'}`);
        }

        const data = await response.json();
        const seguimientos = Array.isArray(data) ? data : [];

        const seguimientosOrdenados = [...seguimientos].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );

        const eventosMapeados = seguimientosOrdenados.map((seguimiento, index) => {
          // Instancia limpia del día sin importar la hora del registro
          const fechaInicio = seguimiento.follow_up_date
            ? new Date(`${seguimiento.follow_up_date}T00:00:00`)
            : new Date(seguimiento.created_at);

          // Fin del evento por defecto estándar (para cumplir requerimiento visual de Big Calendar)
          const fechaFin = new Date(fechaInicio.getTime() + 60 * 60 * 1000);

          // Lógica de estado evaluada puramente a nivel de fechas (Día de hoy vs Día del evento)
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          
          const fechaComparar = new Date(fechaInicio);
          fechaComparar.setHours(0, 0, 0, 0);

          const estadoCalculado = fechaComparar < hoy ? 'Finalizado' : 'Pendiente';

          return {
            id: seguimiento.id,
            title: `Seguimiento #${index + 1}`,
            start: fechaInicio,
            end: fechaFin,
            fechaStr: formatDate(seguimiento.follow_up_date), 
            descripcion: seguimiento.description || 'Sin descripción',
            progreso: seguimiento.progress || 0, 
            comentario: seguimiento.comment || 'Sin comentarios registrados',
            supervisorId: seguimiento.practices?.supervisors?.id || null,
            responsable:
              `${seguimiento.practices?.supervisors?.first_name || ''} ${seguimiento.practices?.supervisors?.last_name || ''}`.trim()
              || 'Supervisor no asignado',
            estado: estadoCalculado,
            tipo: 'seguimiento'
          };
        });

        setEventos(eventosMapeados);
      } catch (error) {
        console.error('Error obteniendo seguimientos:', error.message);
        setErrorFetch(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) obtenerSeguimientos();
  }, [studentId, token]);

  const todosLosEventosCalendario = [...eventos, ...pendientesLocales];
  const nombreMostrar = userObj?.first_name || 'Estudiante';

  const handleNavigate = (newDate) => setCurrentDate(newDate);
  const handleViewChange = (newView) => setCurrentView(newView);

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';
    if (event.tipo === 'pendiente') backgroundColor = '#f59e0b';
    else if (event.estado === 'Finalizado') backgroundColor = '#10b981';

    return {
      style: { backgroundColor, color: 'white', borderRadius: '5px', border: 'none', display: 'block' }
    };
  };

  const eventosFiltrados = eventos.filter((evento) => {
    if (filtroEstado === 'Todos') return true;
    return evento.estado === filtroEstado;
  });

  return (
    <div className="agenda-layout">
      <Sidebar />

      <main className="agenda-main">
        <Navbar nombreMostrar={nombreMostrar} />

        <section className="agenda-header">
          <div>
            <h2>Agenda Académica</h2>
            <p>Organiza reuniones, entregas y seguimientos entre estudiante, tutor académico y empresa.</p>
          </div>
        </section>

        <section className="agenda-calendar-section">
          <Calendar
            localizer={localizer}
            events={todosLosEventosCalendario}
            startAccessor="start"
            endAccessor="end"
            culture="es"
            date={currentDate}
            view={currentView}
            onNavigate={handleNavigate}
            onView={handleViewChange}
            eventPropGetter={eventStyleGetter}
            className="agenda-rbc-calendar"
            messages={{
              next: "Siguiente", previous: "Anterior", today: "Hoy",
              month: "Mes", week: "Semana", day: "Día", agenda: "Lista"
            }}
          />
        </section>

        <section className="agenda-events">
          <div className="agenda-events-header">
            <h3>Detalle de Seguimientos Programados</h3>
            
            <div className="agenda-filtro-container">
              <label htmlFor="filtro-estado">Mostrar:</label>
              <select
                id="filtro-estado"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="Todos">Todos los seguimientos</option>
                <option value="Pendiente">Pendientes</option>
                <option value="Finalizado">Finalizados</option>
              </select>
            </div>
          </div>

          <div className="events-container">
            {loading ? (
              <p>Cargando seguimientos...</p>
            ) : errorFetch ? (
              <div><strong>Error al cargar los datos:</strong> {errorFetch}</div>
            ) : eventosFiltrados.length === 0 ? (
              <p>No hay seguimientos registrados en este estado ({filtroEstado.toLowerCase()}s).</p>
            ) : (
              eventosFiltrados.map((evento) => (
                <div className="event-card" key={evento.id}>
                  <div className="event-top">
                    <div>
                      <h4>{evento.title}</h4>
                      <span className={`estado ${evento.estado.toLowerCase()}`}>
                        {evento.estado}
                      </span>
                    </div>
                    <CheckCircle size={22} />
                  </div>

                  <div className="event-info">
                    <p><strong>Fecha:</strong> {evento.fechaStr}</p>
                    <p><strong>Responsable:</strong> {evento.responsable}</p>
                  </div>

                  <p className="event-description">{evento.descripcion}</p>

                  <div className="event-actions">
                    <button className="btn-primary" onClick={() => setEventoSeleccionado(evento)}>
                      Ver detalle
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <DetalleEventoModal 
          evento={eventoSeleccionado} 
          onClose={() => setEventoSeleccionado(null)} 
        />
        
      </main>
    </div>
  );
};

export default Agenda;