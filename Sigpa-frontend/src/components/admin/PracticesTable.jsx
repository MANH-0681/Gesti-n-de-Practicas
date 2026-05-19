import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Edit, Trash2, PlusCircle} from 'lucide-react';
import '../../styles/styles-supervisor/table.css';

const PracticesTable = ({ practices, onEdit, onDelete, onCreate }) => {
  const navigate = useNavigate();

  return (
    <div className="table-container">
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Prácticas Registradas</h3>
            <button className="add-btn" onClick={onCreate} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <PlusCircle size={18} /> Nueva Práctica
            </button>
        </div>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Docente</th>
            <th>Supervisor</th>
            <th>Vacante</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Horas</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {practices.map((p) => (
            <tr key={p.id}>
              <td>{p.students?.first_name} {p.students?.last_name}</td>
              <td>{p.teachers?.first_name} {p.teachers?.last_name}</td>
              <td>{p.supervisors?.first_name} {p.supervisors?.last_name}</td>
              <td>{p.vacants?.title || '-'}</td>
              <td>{p.start_date}</td>
              <td>{p.end_date}</td>
              <td>{p.practice_hours || '-'}</td>
              <td>{p.description?.substring(0, 30) || '-'}...</td>
              <td>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => onEdit(p)} className="edit-btn" title="Editar">
                        <Edit size={16} />
                    </button>
                    <button onClick={() => onDelete(p.id)} className="delete-btn" title="Eliminar">
                        <Trash2 size={16} />
                    </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PracticesTable;
