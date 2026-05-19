import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Edit, Trash2, PlusCircle} from 'lucide-react';
import '../../styles/styles-supervisor/table.css';

const BusinessesTable = ({ businesses, onEdit, onDelete, onCreate }) => {
  const navigate = useNavigate();

  return (
    <div className="table-container">
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Empresas Registradas</h3>
            <button className="add-btn" onClick={onCreate} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <PlusCircle size={18} /> Nueva Empresa
            </button>
        </div>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>NIT</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Ciudad</th>
            <th>Sector</th>
            <th>Web</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {businesses.map((b) => (
            <tr key={b.id}>
              <td>{b.company_name}</td>
              <td>{b.nit}</td>
              <td>{b.address}</td>
              <td>{b.cell_phone}</td>
              <td>{b.mail}</td>
              <td>{b.city}</td>
              <td>{b.sector}</td>
              <td>{b.website}</td>
              <td>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => onEdit(b)} className="edit-btn" title="Editar">
                        <Edit size={16} />
                    </button>
                    <button onClick={() => onDelete(b.id)} className="delete-btn" title="Eliminar">
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

export default BusinessesTable;
