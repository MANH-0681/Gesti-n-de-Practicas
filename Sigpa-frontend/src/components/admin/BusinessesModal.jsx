import React, { useState, useEffect } from 'react';
import '../../styles/styles-supervisor/modal.css';

const BusinessesModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState({
    company_name: '',
    nit: '',
    address: '',
    cell_phone: '',
    mail: '',
    city: '',
    sector: '',
    website: '',
    document_types_id: 2
  });

  // 2. Efecto para rellenar el formulario si se va a EDITAR (cuando initialData tenga algo)
  useEffect(() => {
    if (isOpen && initialData) {
      setForm({
        company_name: initialData.company_name || '',
        nit: initialData.nit || '',
        address: initialData.address || '',
        cell_phone: initialData.cell_phone || '',
        mail: initialData.mail || '',
        city: initialData.city || '',
        sector: initialData.sector || '',
        website: initialData.website || '',
        document_types_id: initialData.document_types_id || 2
      });
    } else if (!isOpen) {
      // Limpiamos el formulario al cerrar el modal
      setForm({
        company_name: '', nit: '', address: '', cell_phone: '', mail: '', city: '', sector: '', website: '', document_types_id: 2
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 3. Modificamos el submit para que NO haga el fetch interno, sino que use el prop central
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form); // Le envía los datos del formulario a la función handleSave de Empresas.jsx
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialData ? 'Editar Empresa' : 'Registrar Empresa'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input name="company_name" value={form.company_name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>NIT</label>
            <input name="nit" value={form.nit} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input name="address" value={form.address} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input name="cell_phone" value={form.cell_phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Correo</label>
            <input name="mail" value={form.mail} onChange={handleChange} type="email" />
          </div>

          <div className="form-group">
            <label>Ciudad</label>
            <input name="city" value={form.city} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Sector</label>
            <input name="sector" value={form.sector} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Web</label>
            <input name="website" value={form.website} onChange={handleChange} />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default BusinessesModal;
