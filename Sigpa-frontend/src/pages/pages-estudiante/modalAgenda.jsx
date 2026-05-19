import React from 'react';

// --- ESTILOS EN LÍNEA ADAPTADOS A TU PALETA DE COLORES ---
const overlayStyle = { 
  position: 'fixed', 
  top: 0, 
  left: 0, 
  right: 0, 
  bottom: 0, 
  backgroundColor: 'rgba(15, 23, 42, 0.6)', // Desenfoque oscuro elegante basado en tus neutros
  backdropFilter: 'blur(4px)', // Efecto esmerilado moderno
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  zIndex: 9999 
};

const cardStyle = { 
  backgroundColor: 'var(--color-surface)', 
  padding: '25px', 
  borderRadius: '12px', 
  width: '90%', 
  maxWidth: '500px', 
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', 
  maxHeight: '90vh', 
  overflowY: 'auto', 
  color: 'var(--color-text)',
  border: '1px solid var(--color-border)'
};

const boxStyle = { 
  backgroundColor: 'var(--color-bg)', 
  padding: '12px', 
  borderRadius: '8px', 
  border: '1px solid var(--color-border)', 
  marginBottom: '15px', 
  whiteSpace: 'pre-line',
  color: 'var(--color-text)'
};

const DetalleEventoModal = ({ evento, onClose }) => {
  if (!evento) return null;

  return (
    <div className="modal-overlay" style={overlayStyle} onClick={onClose}>
      <div className="modal-card" style={cardStyle} onClick={(e) => e.stopPropagation()}>
        
        {/* Cabecera del Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, color: 'var(--color-primary-dark)', fontWeight: '600' }}>
            {evento.title}
          </h3>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--color-muted)', width: '28px', height: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            ✖
          </button>
        </div>
        
        {/* Cuerpo del Modal */}
        <div>
          <p><strong>Fecha:</strong> {evento.fechaStr}</p>
          <p><strong>Encargado:</strong> {evento.responsable}</p>
          <p>
            <strong>Estado Actual:</strong>{' '}
            <span style={{ color: evento.estado === 'Finalizado' ? '#10b981' : 'var(--color-primary)' }}>
              {evento.estado}
            </span>
          </p>

          
          <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />
          
          <p style={{ fontWeight: '600', marginBottom: '6px' }}>Descripción del Seguimiento:</p>
          <div style={boxStyle}>{evento.descripcion}</div>
          
          <p style={{ fontWeight: '600', marginBottom: '6px' }}>Comentarios / Observaciones:</p>
          <div style={boxStyle}>{evento.comentario}</div>
        </div>
      </div>
    </div>
  );
};

export default DetalleEventoModal;