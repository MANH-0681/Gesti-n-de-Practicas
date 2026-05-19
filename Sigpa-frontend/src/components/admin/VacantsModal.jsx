import React, { useState, useEffect } from 'react';
import { Building, Briefcase, Clock } from 'lucide-react';
import '../../styles/styles-supervisor/modal.css';

const VacantsModal = ({ isOpen, onClose, onSubmit, initialData, businesses, modalities, timeModalities }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '',
    modality_id: '',
    time_modality_id: '',
    businesses_id: ''
  });

  // Llenar formulario al editar
  useEffect(() => {
    if (isOpen && initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        requirements: initialData.requirements || '',
        modality_id: initialData.modality_id || '',
        time_modality_id: initialData.time_modality_id || '',
        businesses_id: initialData.businesses_id || ''
      });
    } else if (!isOpen) {
      setForm({
        title: '',
        description: '',
        requirements: '',
        modality_id: '',
        time_modality_id: '',
        businesses_id: ''
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialData ? 'Editar Vacante' : 'Registrar Vacante'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>

          <div className="input-group-general">
            <label>Empresa</label>
            <div className="input-icon-general">
              <Building size={18} />
              <select name="businesses_id" value={form.businesses_id} onChange={handleChange} required>
                <option value="">Selecciona una empresa</option>
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.company_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group-general">
            <label>Modalidad</label>
            <div className="input-icon-general">
              <Briefcase size={18} />
              <select name="modality_id" value={form.modality_id} onChange={handleChange} required>
                <option value="">Selecciona una modalidad</option>
                {modalities.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group-general">
            <label>Tiempo de Dedicación</label>
            <div className="input-icon-general">
              <Clock size={18} />
              <select name="time_modality_id" value={form.time_modality_id} onChange={handleChange} required>
                <option value="">Selecciona un tipo de tiempo</option>
                {timeModalities.map((tm) => (
                  <option key={tm.id} value={tm.id}>
                    {tm.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="4" />
          </div>

          <div className="form-group">
            <label>Requisitos</label>
            <textarea name="requirements" value={form.requirements} onChange={handleChange} rows="4" />
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

export default VacantsModal;
