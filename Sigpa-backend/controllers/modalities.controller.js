const db = require("../models/bd");

const getAllModalities = async (req, res) => {
    if (!req.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    try {
        const { data: modalities, error } = await db
            .from('modalities')
            .select('*')
            .eq('active', true);

        if (error) throw error;

        res.json(modalities);

    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllModalities
};
