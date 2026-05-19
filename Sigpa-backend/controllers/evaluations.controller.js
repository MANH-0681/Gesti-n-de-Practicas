const supabase = require("../models/bd");

// Obtener evaluaciones de una práctica específica
const getEvaluationsByPractice = async (req, res) => {
    const { practicaId } = req.params;
    try {
        const { data, error } = await supabase
            .from('evaluations')
            .select('*')
            .eq('practices_id', practicaId)
            .is('deleted_at', null)
            .order('evaluation_date', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Crear evaluación
const createEvaluation = async (req, res) => {
    try {
        const { evaluation_date, rating, comment, practices_id } = req.body;
        const { data, error } = await supabase
            .from('evaluations')
            .insert([{ evaluation_date, rating, comment, practices_id }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Editar evaluación
const updateEvaluation = async (req, res) => {
    const { id } = req.params;
    try {
        const { evaluation_date, rating, comment } = req.body;
        const { data, error } = await supabase
            .from('evaluations')
            .update({ evaluation_date, rating, comment, updated_at: new Date() })
            .eq('id', id)
            .select();

        if (error) throw error;
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar evaluación (Soft Delete)
const deleteEvaluation = async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('evaluations')
            .update({ deleted_at: new Date(), active: false })
            .eq('id', id);

        if (error) throw error;
        res.status(200).json({ message: "Evaluación eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getEvaluationsByPractice,
    createEvaluation,
    updateEvaluation,
    deleteEvaluation
};