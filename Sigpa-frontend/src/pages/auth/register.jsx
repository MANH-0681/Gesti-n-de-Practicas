import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  School,
  BookOpen,
  GraduationCap,
  ArrowLeft,
  Briefcase,
  Users,
} from 'lucide-react';

import '../../styles/styles-auth/register.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [faculties, setFaculties] = useState([]);
  const [careers, setCareers] = useState([]);

  const [formData, setFormData] = useState({
    accountType: 'student',

    first_name: '',
    middle_name: '',
    last_name: '',
    second_last_name: '',

    document_number: '',
    cell_phone: '',

    email: '',
    semester: '',

    address: '',

    university: '3',
    faculty: '',
    career: '',

    speciality: '',

    password: '',
    confirmPassword: '',
  });
  
  useEffect(() => {
  loadFaculties();
}, []);

const loadFaculties = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;

    // Universidad fija = 3
    const universityId = 3;

    // Guardamos universidad fija en el form
    setFormData((prev) => ({
      ...prev,
      university: universityId,
    }));

    const res = await fetch(
      `${apiUrl}/universities/${universityId}/faculties`
    );

    const data = await res.json();

    setFaculties(data);
  } catch (error) {
    console.error(error);
  }
};

  const handleFacultyChange = async (e) => {
    const facultyId = e.target.value;

    setFormData({
      ...formData,
      faculty: facultyId,
      career: '',
    });

    setCareers([]);

    if (!facultyId) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(
        `${apiUrl}/universities/faculties/${facultyId}/careers`
      );
      const data = await res.json();

      setCareers(data);
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // INPUTS
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      first_name,
      last_name,
      document_number,
      email,
      password,
      confirmPassword,
      accountType,
    } = formData;

    if (
      !first_name ||
      !last_name ||
      !document_number ||
      !email ||
      !password
    ) {
      alert('Todos los campos obligatorios deben llenarse');
      return;
    }

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    let endpoint = '';
    let body = {};

    if (accountType === 'student') {
      if (!formData.career) {
        alert('Debes seleccionar una carrera');
        return;
      }

      endpoint = `${import.meta.env.VITE_API_URL}/student/Createstudents`;

      body = {
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        second_last_name: formData.second_last_name,
        document_number: formData.document_number,
        mail: formData.email,
        cell_phone: formData.cell_phone,
        semester: parseInt(formData.semester),
        address: formData.address,
        careers_id: parseInt(formData.career),
        universities_id: 3,
        document_types_id: 1,
        password: formData.password,
      };
    } else {
      if (accountType === 'teacher' && !formData.university) {
        alert('Debes seleccionar una universidad');
        return;
      }
      endpoint = `${import.meta.env.VITE_API_URL}/teachers/crearteacher`;
      body = {
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        second_last_name: formData.second_last_name,
        document_number: formData.document_number,
        mail: formData.email,
        cell_phone: formData.cell_phone,
        speciality: formData.speciality,
        address: formData.address,
        universities_id: 3,
        document_types_id: 1,
        password: formData.password,
        };
      }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Cuenta creada con éxito');

        navigate('/login');
      } else {
        alert(data.message || 'Error al crear usuario');
      }
    } catch (error) {
      console.error(error);

      alert('Error conectando con el servidor');
    }
  };

  return (
    <main className="register-container" style={{ overflowY: 'auto', maxHeight: '100vh' }}>
      <form
        className="form-register"
        onSubmit={handleSubmit}
      >
        {/* HEADER */}

        <div className="register-header">
          <GraduationCap size={42} />

          <h2>Crear Cuenta</h2>
        </div>

        {/* TIPO DE CUENTA */}

        <div className="input-group full">
          <label>Tipo de cuenta</label>

          <div className="input-icon">
            <Users size={18} />

            <select
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
            >
              <option value="student">
                Estudiante
              </option>

              <option value="teacher">
                Profesor
              </option>

              <option value="supervisor">
                Supervisor
              </option>
            </select>
          </div>
        </div>

        {/* NOMBRES */}

        <div className="input-group">
          <label>Primer nombre</label>

          <div className="input-icon">
            <User size={18} />

            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-group">
          <label>Segundo nombre</label>

          <div className="input-icon">
            <User size={18} />

            <input
              type="text"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* APELLIDOS */}

        <div className="input-group">
          <label>Apellido</label>

          <div className="input-icon">
            <User size={18} />

            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-group">
          <label>Segundo apellido</label>

          <div className="input-icon">
            <User size={18} />

            <input
              type="text"
              name="second_last_name"
              value={formData.second_last_name}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* DOCUMENTO */}

        <div className="input-group">
          <label>Documento</label>

          <div className="input-icon">
            <User size={18} />

            <input
              type="text"
              name="document_number"
              value={formData.document_number}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* TELEFONO */}

        <div className="input-group">
          <label>Teléfono</label>

          <div className="input-icon">
            <Phone size={18} />

            <input
              type="text"
              name="cell_phone"
              value={formData.cell_phone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* EMAIL */}

        <div className="input-group full">
          <label>Correo</label>

          <div className="input-icon">
            <Mail size={18} />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* DIRECCION */}

        <div className="input-group full">
          <label>Dirección</label>

          <div className="input-icon">
            <MapPin size={18} />

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ========================= */}
        {/* ESTUDIANTE */}
        {/* ========================= */}

        {formData.accountType === 'student' && (
          <>
            <div className="input-group">
              <label>Semestre</label>

              <div className="input-icon">
                <BookOpen size={18} />

                <input
                  type="number"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                />
              </div>
            </div>



            <div className="input-group ">
              <label>Facultad</label>

              <div className="input-icon">
                <BookOpen size={18} />

                <select
                  value={formData.faculty}
                  onChange={handleFacultyChange}
                  disabled={!faculties.length}
                >
                  <option value="">
                    Seleccione facultad
                  </option>

                  {faculties.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Carrera</label>

              <div className="input-icon">
                <GraduationCap size={18} />

                <select
                  name="career"
                  value={formData.career}
                  onChange={handleChange}
                  disabled={!careers.length}
                >
                  <option value="">
                    Seleccione carrera
                  </option>

                  {careers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        {/* ========================= */}
        {/* PROFESOR */}
        {/* ========================= */}

        {formData.accountType === 'teacher' && (
          <div className="input-group ">
            <label>Especialidad</label>

            <div className="input-icon">
              <Briefcase size={18} />

              <input
                type="text"
                name="speciality"
                value={formData.speciality}
                onChange={handleChange}
                placeholder="Ej: Matemáticas"
              />
            </div>
          </div>
        )}

        {/* PASSWORD */}

        <div className="input-group">
          <label>Contraseña</label>

          <div className="input-icon">
            <Lock size={18} />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* CONFIRMAR */}

        <div className="input-group">
          <label>Confirmar contraseña</label>

          <div className="input-icon">
            <Lock size={18} />

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* BOTONES */}

       <div className="register-actions">
        <button type="submit" className="primary-btn">
          Crear cuenta
        </button>

        <button
          type="button"
          className="secondary-btn"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={18} />
          Volver
        </button>
      </div>
      </form>
    </main>
  );
};


export default RegisterPage;