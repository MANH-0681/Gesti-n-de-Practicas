import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/VacantesDisponibles.css';

const VacantesDisponibles = () => {
  const [vacantes, setVacantes] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [cargando, setCargando] = useState(true);
  const POR_PAGINA = 4;

  useEffect(() => {
    const fetchVacantes = async () => {
      setCargando(true);
      const desde = pagina * POR_PAGINA;
      const hasta = desde + POR_PAGINA - 1;

      const { data, error } = await supabase
        .from('vacants')
        .select('*')
        .order('publication_date', { ascending: false })
        .range(desde, hasta);

      if (error) {
        console.error('Error cargando vacantes:', error.message);
      } else {
        setVacantes(data || []);
      }
      setCargando(false);
    };

    fetchVacantes();
  }, [pagina]);

  return (
    <div className="grid-card">
      <div className="grid-card-header">
        <div className="grid-card-title">
          <Briefcase size={18} />
          <h3>Vacantes disponibles para ti</h3>
        </div>
        <div className="paginacion">
          <button
            className="pag-btn"
            onClick={() => setPagina(p => Math.max(0, p - 1))}
            disabled={pagina === 0 || cargando}
          >
            <ChevronLeft size={16} />
          </button>
          <span>{pagina + 1}</span>
          <button
            className="pag-btn"
            onClick={() => setPagina(p => p + 1)}
            disabled={vacantes.length < POR_PAGINA || cargando}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="vacantes-lista">
        {cargando ? (
          <p className="estado-carga">Cargando vacantes...</p>
        ) : vacantes.length === 0 ? (
          <p className="estado-vacio">No hay vacantes disponibles.</p>
        ) : (
          vacantes.map(v => (
            <div key={v.id} className="vacante-item">
              <div className="vacante-info">
                <h4>{v.title}</h4>
                <p>{v.description?.substring(0, 65)}...</p>
                <span className="vacante-fecha">{v.publication_date}</span>
              </div>
              <button className="btn-postular">Postular</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VacantesDisponibles;