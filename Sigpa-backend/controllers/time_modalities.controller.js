const db = require("../models/bd");

const getAllTimeModalities = async (req, res) => {
    if (!req.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    try {
        const { data: timeModalities, error } = await db
            .from('time_modalities')
            .select('*')
            .eq('active', true);

        if (error) throw error;

        res.json(timeModalities);

    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllTimeModalities
};
