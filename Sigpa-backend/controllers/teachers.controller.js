const supabase = require("../models/bd");
const bcrypt = require('bcrypt');

const getTeacher = async (req, res) => {
  try {
    const {data, error } = await supabase
      .from('teachers')
      .select('first_name,middle_name,last_name,second_last_name,document_number,mail,cell_phone,speciality,address,document_types(name),universities(name)')
      .eq('active', true)
      .is('deleted_at', null);

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTeacherAdmin = async (req, res) => {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      second_last_name,
      document_number,
      mail,
      cell_phone,
      speciality,
      address,
      document_types_id,
      universities_id,
      password
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('teachers')
      .insert([
        {
          first_name,
          middle_name,
          last_name,
          second_last_name,
          document_number,
          mail,
          cell_phone,
          speciality,
          address,
          document_types_id,
          universities_id,
          password: hashedPassword,
          admin: true
        }
      ])
      .select();

    if (error) {
      return res.status(400).json({
        message: "Error al crear docente administrador",
        error: error.message
      });
    }

    res.status(201).json({
      message: "Administrador creado correctamente",
      teacher: data[0]
    });

  } catch (err) {
    res.status(500).json({
      message: "Error del servidor",
      error: err.message
    });
  }
};

const getTeacherById = async (req, res) => {
  const { teacher_id } = req.params;
  try {
    const {data, error } = await supabase
    .from('teachers')
    .select('first_name,middle_name,last_name,second_last_name,document_number,mail,cell_phone,speciality,address,document_types(name),universities(name)')
    .eq('id', teacher_id)
    .eq('active', true)
    .is('deleted_at', null);
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTeacherByIdStudents = async (req, res) => {
  const { teacher_id } = req.params;

  try {
    const { data, error } = await supabase
      .from("teachers")
      .select(`
        first_name,
        middle_name,
        last_name,
        second_last_name,
        document_number,
        mail,
        cell_phone,
        speciality,
        address,
        document_types ( name ),
        universities ( name ),
        practices (
          students (
            first_name,
            middle_name,
            last_name,
            second_last_name,
            document_number,
            mail,
            cell_phone,
            address,
            semester
          )
        )
      `)
      .eq("id", teacher_id)
      .eq("active", true)
      .is("deleted_at", null);

    if (error) throw error;

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- Función para el Dashboard del Teacher ---
const getTeacherDashboardData = async (req, res) => {
  const teacherId = req.usuario.id;

  try {
    // 1. Obtener info del docente
    const { data: teacherInfo, error: teacherError } = await supabase
      .from('teachers')
      .select('*, universities(*)')
      .eq('id', teacherId)
      .single();

    if (teacherError) throw teacherError;

    // 2. Obtener prácticas y sus evaluaciones
    // Hacemos un join para traer las evaluaciones vinculadas a las prácticas del profesor
    const { data: practices, error: practicesError } = await supabase
            .from('practices')
            .select(`
                id,
                description,
                start_date,
                end_date,
                active,
                students (
                    id,
                    first_name,
                    last_name,
                    mail,
                    semester,
                    careers ( name )
                )
            `)
            .eq('teachers_id', teacherId)
            .is('deleted_at', null);

        if (practicesError) throw practicesError;

    const practiceIds = practices.map(p => p.id);
    
    let totalEvaluations = 0;
    let averageRating = "0.0";

    // Si el docente tiene prácticas, buscamos sus evaluaciones correspondientes
    let evaluationByPractice = {};
    if (practiceIds.length > 0) {
      const { data: evaluations, error: evaluationsError } = await supabase
        .from('evaluations')
        .select('practices_id, rating')
        .in('practices_id', practiceIds)
        .is('deleted_at', null);

      if (evaluationsError) throw evaluationsError;

      // Calcular métricas globales y por práctica
      totalEvaluations = evaluations.length;
      const summaries = evaluations.reduce((acc, curr) => {
        const practiceId = curr.practices_id;
        if (!acc[practiceId]) {
          acc[practiceId] = { count: 0, sum: 0 };
        }
        acc[practiceId].count += 1;
        acc[practiceId].sum += parseFloat(curr.rating) || 0;
        return acc;
      }, {});

      evaluationByPractice = summaries;

      if (totalEvaluations > 0) {
        const sum = evaluations.reduce((acc, curr) => acc + (parseFloat(curr.rating) || 0), 0);
        averageRating = (sum / totalEvaluations).toFixed(1);
      }
    }

    const enrichedPractices = practices.map(practice => {
      const summary = evaluationByPractice[practice.id] || { count: 0, sum: 0 };
      const practiceAverage = summary.count > 0 ? (summary.sum / summary.count).toFixed(1) : '0.0';
      return {
        ...practice,
        evaluationsCount: summary.count,
        averageRating: practiceAverage
      };
    });

    // 4. Armar el objeto de estadísticas exacto que espera el Frontend
    const metrics = {
      totalStudents: practices.length,
      activePractices: practices.filter(p => p.active).length,
      totalEvaluations: totalEvaluations,
      averageRating: averageRating
    };

    // Responder al cliente
    return res.status(200).json({
      teacher: teacherInfo,
      statistics: metrics,
      studentsList: enrichedPractices
    });

  } catch (error) {
    console.error("Error en Dashboard Teacher:", error);
    return res.status(500).json({ 
        message: "Error al cargar los datos del dashboard",
        error: error.message 
    });
  }
};

const createTeacher = async (req, res) => {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      second_last_name,
      document_number,
      mail,
      cell_phone,
      speciality,
      address,
      document_types_id,
      universities_id,
      password
    } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('teachers')
      .insert([
        {
          first_name,
          middle_name,
          last_name,
          second_last_name,
          document_number,
          mail,
          cell_phone,
          speciality,
          address,
          document_types_id,
          universities_id,
          password: hashedPassword
        }
      ])
      .select();

    if (error) {
      return res.status(400).json({
        message: "Error al crear docente",
        error: error.message
      });
    }

    res.status(201).json({
      message: "Docente creado correctamente",
      teacher: data[0]
    });

  } catch (err) {
    res.status(500).json({
      message: "Error del servidor",
      error: err.message
    });
  }
};

// Obtener TODOS los docentes sin restricciones (para administrador)
const getAllTeachers = async (req, res) => {
    if (!req.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    try {
        const { data: teachers, error } = await supabase
            .from('teachers')
            .select('*, universities ( id, name ), document_types ( id, name )')
            .eq('active', true);

        if (error) throw error;

        res.json(teachers);

    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

// Actualizar docente
const updateTeacher = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    middle_name,
    last_name,
    second_last_name,
    mail,
    cell_phone,
    speciality,
    address
  } = req.body;

  try {
    const { data, error } = await supabase
      .from('teachers')
      .update({
        first_name,
        middle_name,
        last_name,
        second_last_name,
        mail,
        cell_phone,
        speciality,
        address
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    return res.json({
      message: "Docente actualizado con éxito",
      data: data[0]
    });
  } catch (error) {
    console.error("Error al actualizar docente:", error);
    return res.status(500).json({ 
      message: "Error interno del servidor", 
      error: error.message 
    });
  }
};

module.exports = {
    createTeacher,
    createTeacherAdmin,
    getTeacher,
    getTeacherById,
    getTeacherByIdStudents,
    getTeacherDashboardData,
    getAllTeachers,
    updateTeacher
};