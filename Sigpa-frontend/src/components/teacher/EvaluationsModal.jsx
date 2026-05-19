import React, { useState, useEffect } from 'react';
import '../../styles/styles-supervisor/modal.css'; 

const EvaluationsModal = ({ isOpen, onClose, onSubmit, practicaId, initialData }) => {
    const [formData, setFormData] = useState({
        evaluation_date: new Date().toISOString().split('T')[0],
        rating: '5.0',
        comment: '',
        practices_id: practicaId
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                evaluation_date: initialData.evaluation_date.split('T')[0]
            });
        } else {
            setFormData({
                evaluation_date: new Date().toISOString().split('T')[0],
                rating: '5.0',
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

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{initialData ? 'Editar Evaluación' : 'Registrar Evaluación'}</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <label>Fecha de Evaluación:</label>
                        <input 
                            type="date" 
                            name="evaluation_date" 
                            value={formData.evaluation_date} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Calificación (Rating):</label>
                        <input 
                            type="number" 
                            name="rating" 
                            min="0" 
                            max="5" 
                            step="0.1" // <-- Esto permite usar decimales (ej: 3.2, 4.8)
                            value={formData.rating} 
                            onChange={handleChange} 
                            placeholder="Ej: 3.2"
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Comentarios u Observaciones:</label>
                        <textarea 
                            name="comment" 
                            value={formData.comment} 
                            onChange={handleChange} 
                            placeholder="Describe el rendimiento del estudiante..."
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
                        <button type="submit" className="btn-save">{initialData ? 'Actualizar' : 'Guardar'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EvaluationsModal;