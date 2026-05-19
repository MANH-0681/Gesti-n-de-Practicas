import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck } from 'lucide-react';
import '../../styles/styles-supervisor/table.css';

const StudentTable = ({ students }) => {
  const navigate = useNavigate();

  // ✅ Formatear fecha correctamente
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';

    // Opción A: Reemplazar guiones por barras (esto suele forzar modo local en muchos navegadores)
    // const date = new Date(dateString.replace(/-/g, '\/')); 

    // Opción B: Forzar que se trate como UTC pero mostrarlo tal cual
    const date = new Date(dateString);
    
    return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'UTC' // <--- Esto obliga a ignorar el desfase de Bogotá
    });
  };

  // ✅ Calcular progreso automáticamente
  const calculateProgress = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const today = new Date().getTime();

    // Aún no inicia
    if (today < start) return 0;

    // Ya terminó
    if (today >= end) return 100;

    // Tiempo total y transcurrido
    const totalDuration = end - start;
    const elapsed = today - start;

    const progress = (elapsed / totalDuration) * 100;

    return Math.round(progress);
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h3>Estudiantes en Práctica</h3>
      </div>

      <table className="custom-table">
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Carrera</th>
            <th>Descripción</th>
            <th>Fecha de Inicio</th>
            <th>Fecha Fin</th>
            <th>Progreso</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {students.map((item) => {

            const progress = calculateProgress(
              item.start_date,
              item.end_date
            );

            return (
              <tr key={item.id}>
                <td>
                    <div className="student-cell">
                        <div className="student-name-container">
                        <span className="student-name">
                            {item.students.first_name} {item.students.last_name}
                        </span>

                        <span className="student-email">
                            {item.students.mail}
                        </span>
                        </div>
                    </div>
                </td>

                <td>
                  {item.students.careers?.name || 'No asignada'}
                </td>

                <td style={{ maxWidth: '200px' }}>
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#64748b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={item.description}
                  >
                    {item.description || 'Sin descripción'}
                  </div>
                </td>

                {/* ✅ Fechas corregidas */}
                <td>{formatDate(item.start_date)}</td>

                <td>{formatDate(item.end_date)}</td>

                {/* ✅ Barra de progreso */}
                <td>
                  <div className="progress-container">
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <span className="progress-text">
                      {progress}%
                    </span>
                  </div>
                </td>

                <td>
                  <button
                    className="action-btn"
                    title="Ver Seguimientos"
                    onClick={() => navigate(`/seguimientos/${item.id}`)}
                  >
                    <ClipboardCheck size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;