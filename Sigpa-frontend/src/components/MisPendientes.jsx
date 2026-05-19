import React, { useEffect, useState } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2
} from 'lucide-react';
import '../styles/MisPendientes.css';

const MisPendientes = () => {
  const [pendientes, setPendientes] = useState([]);
  const [nuevo, setNuevo] = useState('');
  const [agregando, setAgregando] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const token = localStorage.getItem('token');

  const fetchPendientes = async () => {
    try {
      const res = await fetch(`${apiUrl}/earrings`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      console.log("PENDIENTES:", data);

      setPendientes(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error("ERROR OBTENIENDO PENDIENTES:", error);
    }
  };

  useEffect(() => {
    fetchPendientes();
  }, []);

  const agregar = async () => {
    if (!nuevo.trim()) return;

    try {

      const res = await fetch(`${apiUrl}/earrings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          description: nuevo
        })
      });

      const data = await res.json();

      console.log("NUEVO PENDIENTE:", data);

      if (!data.error) {

            setPendientes([
                data,
                ...pendientes
            ]);
            }

      setNuevo('');
      setAgregando(false);

    } catch (error) {

      console.error(
        "ERROR AGREGANDO PENDIENTE:",
        error
      );
    }
  };

  // =========================
  // ELIMINAR
  // =========================

  const eliminar = async (id) => {

    try {

      await fetch(`${apiUrl}/earrings/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setPendientes(
        pendientes.filter(
          (p) => p.id !== id
        )
      );

    } catch (error) {
      console.error("ERROR ELIMINANDO:", error);
    }
  };

  return (
    <div className="grid-card pendientes-card">
      <div className="grid-card-header">
        <div className="grid-card-title">
          <CheckSquare size={18} />
          <h3>Mis pendientes</h3>
        </div>

        <span className="badge-pendientes">
          {pendientes.length} tareas
        </span>
      </div>

      <ul className="pendientes-lista">
        {pendientes.length === 0 ? (
          <p className="estado-vacio">
            Sin pendientes 🎉
          </p>

        ) : (

          pendientes.map((p) => (

            <li
              key={p.id}
              className="pendiente-item"
            >

              <span className="pendiente-texto-nuevo">
                {p.description}
              </span>

              <button 
                onClick={() => eliminar(p.id)}
                className="btn-eliminar-pendiente"
              >
                <Trash2 size={14} />
              </button>

            </li>
          ))
        )}
      </ul>

      {/* NUEVO */}

      {agregando ? (

        <div className="nuevo-pendiente-form">

          <input
            type="text"
            placeholder="Agregar pendiente..."
            value={nuevo}
            onChange={(e) => setNuevo(e.target.value)}
            onKeyDown={(e) => {

              if (e.key === 'Enter') {
                agregar();
              }
            }}
            className="input-tarea"
          />

          <div className="form-acciones">

            <button 
              onClick={agregar}
              className="btn-confirmar"
            >
              Agregar
            </button>

            <button
              onClick={() => {
                setAgregando(false);
                setNuevo('');
              }}
              className="btn-cancelar"
            >
              Cancelar
            </button>

          </div>

        </div>

      ) : (

        <button
          className="btn-nuevo"
          onClick={() => setAgregando(true)}
        >
          <Plus size={16} />
          Nuevo pendiente
        </button>
      )}
    </div>
  );
};

export default MisPendientes;