import React from 'react';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import '../../styles/styles-supervisor/table.css'; 

const EvaluationsTable = ({ evaluations, onEdit, onDelete, onCreate }) => {

    const formatDate = (dateString) => {
        if (!dateString) return '---';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'UTC'
        });
    };

    return (
        <div className="table-container">
            <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Historial de Evaluaciones</h3>
                <button className="add-btn" onClick={onCreate} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <PlusCircle size={18} /> Nueva Evaluación
                </button>
            </div>

            <table className="custom-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Calificación / Rating</th>
                        <th>Comentario / Observación</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {evaluations.length > 0 ? (
                        evaluations.map((ev) => (
                            <tr key={ev.id}>
                                <td>{formatDate(ev.evaluation_date)}</td>
                                <td>
                                    <span className="badge-rating" style={{ padding: '4px 8px', background: '#e0f2fe', color: '#0369a1', borderRadius: '6px', fontWeight: 'bold' }}>
                                        {ev.rating}
                                    </span>
                                </td>
                                <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={ev.comment}>
                                    {ev.comment || 'Sin comentarios'}
                                </td>
                                <td>
                                    {ev.active ? 
                                        <span className="status-active">Activo</span> : 
                                        <span className="status-inactive">Inactivo</span>
                                    }
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => onEdit(ev)} className="edit-btn" title="Editar">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => onDelete(ev.id)} className="delete-btn" title="Eliminar">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>No hay evaluaciones registradas para este estudiante.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EvaluationsTable;