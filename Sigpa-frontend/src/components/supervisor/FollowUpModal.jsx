import React, { useState, useEffect } from 'react';
import '../../styles/styles-supervisor/modal.css'; // Asegúrate de crear este CSS

const FollowUpModal = ({ isOpen, onClose, onSubmit, practicaId, initialData }) => {
    const [formData, setFormData] = useState({
        follow_up_date: new Date().toISOString().split('T')[0],
        description: '',
        progress: 0,
        comment: '',
        practices_id: practicaId
    });

    // Efecto para cargar los datos si recibimos initialData (Modo Edición)
    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                // Formateamos la fecha para el input type="date"
                follow_up_date: initialData.follow_up_date.split('T')[0]
            });
        } else {
            // Si no hay initialData, limpiamos el formulario (Modo Creación)
            setFormData({
                follow_up_date: new Date().toISOString().split('T')[0],
                description: '',
                progress: 0,
                comment: '',
                practices_id: practicaId
            });
        }
    }, [initialData, isOpen, practicaId]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{initialData ? 'Editar Seguimiento' : 'Registrar Seguimiento'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Fecha del Seguimiento:</label>
                        <input 
                            type="date" 
                            name="follow_up_date" 
                            value={formData.follow_up_date} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Descripción de Actividades:</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            placeholder="¿Qué hizo el estudiante?"
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Progreso (%) - Actual: {formData.progress}%</label>
                        <input 
                            type="range" 
                            name="progress" 
                            min="0" max="100" 
                            value={formData.progress} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Comentario u Observación:</label>
                        <textarea 
                            name="comment" 
                            value={formData.comment} 
                            onChange={handleChange} 
                            placeholder="Opcional..."
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
                        <button type="submit" className="btn-save">{initialData ? 'Actualizar' : 'Registrar'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FollowUpModal;