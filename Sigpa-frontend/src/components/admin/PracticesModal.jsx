import React, { useState, useEffect } from 'react';
import '../../styles/styles-supervisor/modal.css';
import { GraduationCap, BookOpen, UserCheck, FileText } from "lucide-react"

const PracticesModal = ({ isOpen, onClose, onSubmit, initialData, supervisors, students, teachers, vacants }) => {
  const [form, setForm] = useState({
    start_date: '',
    end_date: '',
    description: '',
    practice_hours: '',
    supervisors_id: '',
    students_id: '',
    teachers_id: '',
    vacants_id: ''
  });

  // Llenar formulario al editar
  useEffect(() => {
    if (isOpen && initialData) {
      setForm({
        start_date: initialData.start_date || '',
        end_date: initialData.end_date || '',
        description: initialData.description || '',
        practice_hours: initialData.practice_hours || '',
        supervisors_id: initialData.supervisors_id || '',
        students_id: initialData.students_id || '',
        teachers_id: initialData.teachers_id || '',
        vacants_id: initialData.vacants_id || ''
      });
    } else if (!isOpen) {
      setForm({
        start_date: '',
        end_date: '',
        description: '',
        practice_hours: '',
        supervisors_id: '',
        students_id: '',
        teachers_id: '',
        vacants_id: ''
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
        <h2>{initialData ? 'Editar Práctica' : 'Registrar Práctica'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group-general">
            <label>Estudiante</label>
            <div className="input-icon-general">
              <GraduationCap size={18} />
              <select name="students_id" value={form.students_id} onChange={handleChange} required>
                <option value="">Selecciona un estudiante</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.first_name} {s.last_name} ({s.document_number})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group-general">
            <label>Docente</label>
            <div className="input-icon-general">
              <BookOpen size={18} />
              <select name="teachers_id" value={form.teachers_id} onChange={handleChange} required>
                <option value="">Selecciona un docente</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.first_name} {t.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group-general">
            <label>Supervisor</label>
            <div className="input-icon-general">
              <UserCheck size={18} />
              <select name="supervisors_id" value={form.supervisors_id} onChange={handleChange} required>
                <option value="">Selecciona un supervisor</option>
                {supervisors.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.first_name} {sup.last_name} ({sup.businesses?.company_name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group-general">
            <label>Vacante</label>
            <div className="input-icon-general">
              <FileText size={18} />
              <select name="vacants_id" value={form.vacants_id} onChange={handleChange}>
                <option value="">Selecciona una vacante (opcional)</option>
                {vacants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title} ({v.businesses?.company_name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Fecha Inicio</label>
            <input name="start_date" type="date" value={form.start_date} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Fecha Fin</label>
            <input name="end_date" type="date" value={form.end_date} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Horas de Práctica</label>
            <input name="practice_hours" type="number" value={form.practice_hours} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="4" />
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

export default PracticesModal;
