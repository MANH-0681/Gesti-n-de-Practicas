const supabase = require('../models/bd');

// Obtener TODAS las prácticas sin restricciones (para administrador)
const getAllPractices = async (req, res) => {
    if (!req.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    try {
        const { data: practices, error } = await supabase
            .from('practices')
            .select(`
                *,
                students ( id, first_name, last_name, document_number ),
                supervisors ( id, first_name, last_name, position ),
                vacants ( id, title ),
                teachers ( id, first_name, last_name )
            `)
            .eq('active', true);

        if (error) throw error;

        res.json(practices);

    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

const createPractice = async (req, res) => {
    const { 
        start_date, 
        end_date, 
        description, 
        practice_hours, 
        supervisors_id, 
        vacants_id, 
        students_id,
        teachers_id 
    } = req.body;

   
    if (!start_date || !end_date || !supervisors_id || !students_id || !teachers_id) {
        return res.status(400).json({ 
            message: "Faltan campos obligatorios para registrar la práctica." 
        });
    }

    try {
        const { data, error } = await supabase
            .from('practices')
            .insert([
                { 
                    start_date, 
                    end_date, 
                    description, 
                    practice_hours: parseInt(practice_hours), 
                    supervisors_id, 
                    vacants_id, 
                    students_id, 
                    teachers_id, 
                }
            ])
            .select();

        if (error) throw error;

        return res.status(201).json({
            message: "Práctica creada exitosamente",
            data: data[0]
        });

    } catch (error) {
        console.error("Error en createPractice:", error);
        return res.status(500).json({ 
            message: "Error al registrar la práctica", 
            error: error.message 
        });
    }
};

// Actualizar práctica
const updatePractice = async (req, res) => {
    const { id } = req.params;
    const { start_date, end_date, description, practice_hours, supervisors_id, vacants_id, students_id, teachers_id } = req.body;

    try {
        const { data, error } = await supabase
            .from('practices')
            .update({ start_date, end_date, description, practice_hours: parseInt(practice_hours), supervisors_id, vacants_id, students_id, teachers_id })
            .eq('id', id)
            .select();

        if (error) throw error;

        return res.json({
            message: "Práctica actualizada con éxito",
            data: data[0]
        });
    } catch (error) {
        console.error("Error al actualizar práctica:", error);
        return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

// Eliminar práctica (soft delete)
const deletePractice = async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('practices')
            .update({ active: false }) 
            .eq('id', id)
            .select();

        if (error) throw error;

        return res.json({
            message: "Práctica eliminada de forma lógica con éxito",
            data: data[0]
        });
    } catch (error) {
        console.error("Error en soft delete de práctica:", error);
        return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

const getPracticesByUniversity = async (req, res) => {
  if (!req.usuario) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    // 1. Obtener la universidad del docente/admin actual
    const { data: docente, error: docenteError } = await supabase
      .from('teachers')
      .select('id, universities_id')
      .eq('id', req.usuario.id)
      .single();

    if (docenteError || !docente) {
      return res.status(403).json({ error: 'Usuario o universidad no encontrados' });
    }

    const universities_id = docente.universities_id;

    // 2. Obtener todos los docentes de esa misma universidad
    const { data: teachers } = await supabase
      .from('teachers')
      .select('id')
      .eq('universities_id', universities_id);

    const teacherIds = cleanIds(teachers.map(t => t.id));

    if (teacherIds.length === 0) {
      return res.json([]);
    }

    console.log("Filtrando prácticas para docentes de la universidad:", universities_id);

    const { data: practices, error: practicesError } = await supabase
      .from('practices')
      .select(`
        *,
        students (
          first_name,
          last_name,
          document_number
        ),
        supervisors (
          first_name,
          last_name,
          businesses (
            company_name
          )
        ),
        teachers (
          first_name,
          last_name
        )
      `)
      .in('teachers_id', teacherIds);

    if (practicesError) throw practicesError;

    res.json(practices);

  } catch (error) {
    console.error("ERROR EN GET PRACTICES:", error);
    res.status(500).json({ error: error.message });
  }
};

const cleanIds = (arr) => {
  return [...new Set(
    arr.filter(id => id !== null && id !== undefined)
  )];
};

module.exports = { createPractice, getPracticesByUniversity, getAllPractices, updatePractice, deletePractice };