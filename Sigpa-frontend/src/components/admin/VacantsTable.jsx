import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Edit, Trash2, PlusCircle} from 'lucide-react';
import '../../styles/styles-supervisor/table.css';

const VacantsTable = ({ vacants, onEdit, onDelete, onCreate }) => {
  const navigate = useNavigate();

  return (
    <div className="table-container">
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Vacantes Registradas</h3>
            <button className="add-btn" onClick={onCreate} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <PlusCircle size={18} /> Nueva Vacante
            </button>
        </div>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Empresa</th>
            <th>Modalidad</th>
            <th>Tiempo</th>
            <th>Descripción</th>
            <th>Requisitos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vacants.map((v) => (
            <tr key={v.id}>
              <td>{v.title}</td>
              <td>{v.businesses?.company_name || '-'}</td>
              <td>{v.modalities?.name || '-'}</td>
              <td>{v.time_modalities?.name || '-'}</td>
              <td>{v.description?.substring(0, 30)}...</td>
              <td>{v.requirements?.substring(0, 30)}...</td>
              <td>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => onEdit(v)} className="edit-btn" title="Editar">
                        <Edit size={16} />
                    </button>
                    <button onClick={() => onDelete(v.id)} className="delete-btn" title="Eliminar">
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

export default VacantsTable;
