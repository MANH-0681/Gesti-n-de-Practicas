const db = require("../models/bd");

const getSeguimientosPorPractica = async (req, res) => {
    const { practicaId } = req.params;

    try {
        const { data, error } = await db
            .from("follow_ups")
            .select("*")
            .eq("practices_id", practicaId)
            .eq("active", true)
            .is("deleted_at", null);

        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getReportes = async (req, res) => {
    try {
        const { data, error } = await db
            .from("follow_ups")
            .select("*")
            .not("comment", "is", null)
            .eq("active", true);

        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createSeguimiento = async (req, res) => {
    const {
        follow_up_date,
        description,
        progress,
        comment,
        practices_id
    } = req.body;

    try {
        const { data, error } = await db
            .from("follow_ups")
            .insert([
                {
                    follow_up_date,
                    description,
                    progress,
                    comment,
                    practices_id
                }
            ])
            .select();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSeguimiento = async (req, res) => {
    const { id } = req.params;
    const { follow_up_date, description, progress, comment } = req.body;
    try {
        const { data, error } = await db
            .from("follow_ups")
            .update({ follow_up_date, description, progress, comment, updated_at: new Date() })
            .eq("id", id)
            .select();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteSeguimiento = async (req, res) => {
    const { id } = req.params;
    try {
        // Hacemos un borrado lógico cambiando 'active' a false
        const { error } = await db
            .from("follow_ups")
            .update({ active: false, deleted_at: new Date() })
            .eq("id", id);

        if (error) throw error;
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSeguimientosByPracticaIniEstudiante = async (req, res) => {
    const { practicaId } = req.params;

    try {
        const { data, error } = await db
            .from("follow_ups")
            .select(`
                *,
                practices(
                    id,
                    supervisors(
                        first_name,
                        last_name
                    )
                )
            `)
            .eq("practices_id", practicaId)
            .eq("active", true)
            .is("deleted_at", null);

        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDashboardEstudiante = async (req, res) => {
    console.log("USUARIO TOKEN:", req.usuario);

  const usuarioId = req.usuario.id;



  try {

    const seguimientos = await db
      .from("follow_ups")
      .select(`
        *,
        practices!inner(
          id,
          students_id
        )
      `)
      .eq("active", true)
      .is("deleted_at", null)
      .eq("practices.students_id", usuarioId);


    const evaluaciones = await db
      .from("evaluations")
      .select(`
        *,
        practices!inner(
          id,
          students_id
        )
      `)
      .eq("active", true)
      .is("deleted_at", null)
      .eq("practices.students_id", usuarioId);
    const supervisor = await db
        .from("practices")
        .select(`
            id,
            students_id,
            supervisors (
            id,
            first_name,
            last_name
            )
        `)
        .eq("students_id", usuarioId)
        .order('id', { ascending: false }) // 👈 Trae la práctica más reciente
        .limit(1); // 👈 Evita que rompa si hay más de una

      // Y al momento de enviar la respuesta (res.json):
      res.json({
        follow_ups: seguimientos.data || [],
        evaluations: evaluaciones.data || [],
        supervisor: supervisor.data?.[0]?.supervisors || null, // 👈 Extrae de forma segura el primer resultado
 });

  } catch (error) {

    console.error("ERROR DASHBOARD:", error);

    res.status(500).json({
      error: error.message
    });
  }
};

const getEvaluaciones = async (req, res) => {
  const usuarioId = req.usuario.id;

  try {
    const { data, error } = await db
      .from("evaluations")
      
      .select("*, practices!inner(students_id)") 
      .eq("active", true)
      .is("deleted_at", null)
      .eq("practices.students_id", usuarioId); 

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
    getSeguimientosPorPractica,
    getReportes,
    createSeguimiento,
    updateSeguimiento,
    deleteSeguimiento,
    getSeguimientosByPracticaIniEstudiante,
    getDashboardEstudiante,
    getEvaluaciones
};