import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import RegisterPage from './pages/auth/register';
import LoginPage from './pages/auth/login';
import InicioEstudiante from './pages/pages-estudiante/inicioestudiante';
import Perfil from './pages/pages-estudiante/Perfil';
import Agenda from './pages/pages-estudiante/agenda';
import Evaluaciones from './pages/pages-estudiante/evaluaciones';
import PerfilSupervisor from './pages/pages-supervisor/PerfilSupervisor';
import InicioSupervisor from './pages/pages-supervisor/InicioSupervisor';
import PracticasSupervisor from './pages/pages-supervisor/PracticasSupervisor';
import SeguimientosSupervisor from './pages/pages-supervisor/SeguimientosSupervisor';
import InicioTeacher from './pages/pages-teacher/InicioTeacher';
import PerfilTeacher from './pages/pages-teacher/PerfilTeacher';
import EstudiantesTeacher from './pages/pages-teacher/EstudiantesTeacher';
import EvaluacionesTeacher from './pages/pages-teacher/EvaluacionesTeacher';
import InicioAdmin from './pages/pages-admin/InicioAdmin';
import PerfilAdmin from './pages/pages-admin/PerfilAdmin';
import Empresas from './pages/pages-admin/Empresas';
import Vacantes from './pages/pages-admin/Vacantes';
import Practicas from './pages/pages-admin/Practicas';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/inicio-estudiante" element={<InicioEstudiante />} />
        <Route path="/inicio-supervisor" element={<InicioSupervisor />} />
        <Route path="/perfilSupervisor" element={<PerfilSupervisor />} />
        <Route path="/practicas-supervisor" element={<PracticasSupervisor />} />
        <Route path="/seguimientos/:practicaId" element={<SeguimientosSupervisor />} />
        <Route path="/evaluaciones/:practicaId" element={<EvaluacionesTeacher />} />
        <Route path="/estudiantes-teacher" element={<EstudiantesTeacher />} />
        <Route path="/perfil-teacher" element={<PerfilTeacher />} />
        <Route path="/inicio-teacher" element={<InicioTeacher />} />
        <Route path="/inicio-admin" element={<InicioAdmin />} />
        <Route path="/perfil-admin" element={<PerfilAdmin />} />
        <Route path="/empresas" element={<Empresas />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/vacantes" element={<Vacantes />} />
        <Route path="/evaluaciones" element={<Evaluaciones />} />
        <Route path="/practicas" element={<Practicas />} />
      </Routes>
    </BrowserRouter>  
  );
}

export default App;
