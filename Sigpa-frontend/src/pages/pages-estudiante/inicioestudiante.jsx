import React, { useEffect, useState } from 'react';

import {
  ClipboardList,
  BookOpen,
  Clock,
  User,
  CheckCircle
} from 'lucide-react';

import VacantesDisponibles from '../../components/VacantesDisponibles';
import MisPendientes from '../../components/MisPendientes';
import Sidebar from '../../components/components-estudiante/sidebar';
import StatCard from '../../components/components-estudiante/statcard';

import '../../styles/styles-estudiante/inicioestudiante.css';

const InicioEstudiante = () => {
  const userStr = localStorage.getItem('user_data');

  const userData = userStr
    ? JSON.parse(userStr)
    : null;

  const nombreMostrar = userData
    ? userData.first_name
    : 'Estudiante';

  const apellidoMostrar = userData
    ? userData.last_name
    : '';

  const [seguimientos, setSeguimientos] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [supervisor, setSupervisor] = useState(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const token = localStorage.getItem('token');
      const estudianteId = localStorage.getItem('usuarioId');

      const endpoint = apiUrl
        ? `${apiUrl}/follow-ups/reportes-estudiante`
        : `/follow-ups/reportes-estudiante`;

      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("STATUS:", res.status);

      const text = await res.text();
      console.log("RESPUESTA CRUDA:", text);

      let data; 

      try {
        data = JSON.parse(text);
        console.log("DATA:", data);
      } catch (jsonError) {
        console.error("ERROR PARSEANDO JSON:", jsonError);
        return;
      }


      setSeguimientos(data.follow_ups || []);
      setEvaluaciones(data.evaluations || []);
      setSupervisor(data.supervisor || null);

    } catch (error) {
      console.error("Error cargando dashboard:", error);
      setSeguimientos([]);
      setEvaluaciones([]);
    }
  };

  fetchData();
}, []);



  // =========================
  // STATS
  // =========================

  const totalSeguimientos = seguimientos.length;

  const terminados = seguimientos.filter(
    (s) => Number(s.progress) === 100
  ).length;

  const pendientes = seguimientos.filter(
    (s) => Number(s.progress) < 100
  ).length;

  const conComentarios = seguimientos.filter(
    (s) => s.comment !== null
  ).length;

  const totalEvaluaciones = evaluaciones.length;

  return (
    <div className="dashboard-layout">
      <Sidebar 
        nombreMostrar={nombreMostrar}
        apellidoMostrar={apellidoMostrar}
      />

      <main className="main-content">
        <header className="contenedor-cabecera">
          <div className="bloque-saludo">
            <h1>
              Hola, {nombreMostrar} 👋
            </h1>

            <p>
              Bienvenido a tu panel organizado
            </p>

          </div>
        </header>

        {/* CARDS */}

        <section className="stats-grid">
          <StatCard
            title="Seguimientos"
            value={totalSeguimientos}
            icon={<ClipboardList size={28} />}
          />

          <StatCard
            title="Supervisor"
            value={
              supervisor
                ? `${supervisor.first_name} ${supervisor.last_name}`
                : 'Sin asignar'
            }
            icon={<CheckCircle size={28} />}
          />

          <StatCard
            title="Evaluaciones"
            value={totalEvaluaciones}
            icon={<BookOpen size={28} />}
          />
        </section>

        {/* COMPONENTES */}

        <div className="dashboard-fila">
          <VacantesDisponibles />
          <MisPendientes />
        </div>

      </main>
    </div>
  );
};

export default InicioEstudiante;
