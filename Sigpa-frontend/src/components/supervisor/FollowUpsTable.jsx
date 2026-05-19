import React from 'react';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import '../../styles/styles-supervisor/table.css'; // Reutilizamos tus estilos de tabla

const FollowUpsTable = ({ followUps, onEdit, onDelete, onCreate }) => {

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
                <h3>Historial de Seguimientos</h3>
                <button className="add-btn" onClick={onCreate} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <PlusCircle size={18} /> Nuevo Seguimiento
                </button>
            </div>

            <table className="custom-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Progreso</th>
                        <th>Descripción</th>
                        <th>Comentario</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {followUps.length > 0 ? (
                        followUps.map((fp) => (
                            <tr key={fp.id}>
                                <td>{formatDate(fp.follow_up_date)}</td>
                                <td>
                                    <span className={`badge progress-${fp.progress}`}>
                                        {fp.progress}%
                                    </span>
                                </td>
                                <td className="truncate-text" title={fp.description}>
                                    {fp.description}
                                </td>
                                <td className="truncate-text" title={fp.comment}>
                                    {fp.comment || 'Sin comentarios'}
                                </td>
                                <td>
                                    {fp.active ? 
                                        <span className="status-active">Activo</span> : 
                                        <span className="status-inactive">Inactivo</span>
                                    }
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => onEdit(fp)} className="edit-btn" title="Editar">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => onDelete(fp.id)} className="delete-btn" title="Eliminar">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>No hay seguimientos registrados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default FollowUpsTable;