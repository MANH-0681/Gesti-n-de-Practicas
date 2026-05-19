const db = require("../models/bd");

// Obtener TODAS las vacantes sin restricciones (para administrador)
const getAllVacants = async (req, res) => {
    if (!req.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    try {
        const { data: vacants, error } = await db
            .from('vacants')
            .select('*, businesses ( id, company_name ), modalities ( id, name ), time_modalities ( id, name )')
            .eq('active', true);

        if (error) throw error;

        res.json(vacants);

    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener todas las vacantes (función restrictiva original)
const getTodaslasOfertas = async (req, res) => {
    try {
        const { data, error } = await db
            .from('vacants')
            .select('*, businesses ( company_name )')
            .eq('active', true)
            .is('deleted_at', null);
        if (error) throw error;
            res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDetallePractica = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await db
            .from('vacants')
            .select('*, businesses ( company_name )')
            .eq('id', id)
            .eq('active', true)
            .is('deleted_at', null)
            .single();
        if (error) throw error;
        if (!data){
            return res.status(404).json({ error: 'La vacante que busca no existe' });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPracticasDisponibles = async (req, res) => {
    try {
        const { data, error } = await db
            .from('vacants')
            .select('*, businesses ( company_name )')
            .eq('active', true)
            .is('deleted_at', null);
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear vacante
const crearOferta = async (req, res) => {
    const { title, description, requirements, modality_id, time_modality_id, businesses_id } = req.body;
    try {
        const { data, error } = await db
            .from('vacants')
            .insert([{ 
                title, 
                description, 
                requirements, 
                modality_id,
                time_modality_id,
                businesses_id,
                active: true,
                publication_date: new Date()
            }
        ])
        .select();
        if (error) throw error;
        res.status(201).json({message: 'Oferta creada exitosamente', data});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear vacante (para administrador)
const createVacant = async (req, res) => {
    const { title, description, requirements, modality_id, time_modality_id, businesses_id } = req.body;
    
    try {
        const { data, error } = await db
            .from('vacants')
            .insert([{ 
                title, 
                description, 
                requirements, 
                modality_id,
                time_modality_id,
                businesses_id,
                active: true,
                publication_date: new Date()
            }])
            .select();

        if (error) throw error;

        return res.status(201).json({
            message: "Vacante creada exitosamente",
            data: data[0]
        });

    } catch (error) {
        console.error("Error al crear vacante:", error);
        return res.status(500).json({ 
            message: "Error interno del servidor", 
            error: error.message 
        });
    }
};

// Actualizar vacante
const updateVacant = async (req, res) => {
    const { id } = req.params;
    const { title, description, requirements, modality_id, time_modality_id, businesses_id } = req.body;

    try {
        const { data, error } = await db
            .from('vacants')
            .update({ title, description, requirements, modality_id, time_modality_id, businesses_id })
            .eq('id', id)
            .select();

        if (error) throw error;

        return res.json({
            message: "Vacante actualizada con éxito",
            data: data[0]
        });
    } catch (error) {
        console.error("Error al actualizar vacante:", error);
        return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

// Eliminar vacante (soft delete)
const deleteVacant = async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await db
            .from('vacants')
            .update({ active: false }) 
            .eq('id', id)
            .select();

        if (error) throw error;

        return res.json({
            message: "Vacante eliminada de forma lógica con éxito",
            data: data[0]
        });
    } catch (error) {
        console.error("Error en soft delete de vacante:", error);
        return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

const postularEstudiante = async (req, res) => {
    const {id} = req.params;
    const {
        students_id, 
        start_date, 
        end_date, 
        description, 
        practice_hours, 
        supervisors_id, 
        teachers_id
    } = req.body;
    try {
        const { data, error } = await db
            .from('practices')
            .insert([
                {
                    vacants_id: id,
                    students_id, 
                    start_date,
                    end_date,
                    description,
                    practice_hours,
                    supervisors_id,
                    teachers_id,
                    active: true
                }
            ])
            .select();
        if (error) throw error;
        res.status(201).json({message: 'Postulación realizada exitosamente', data});
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllVacants,
    getTodaslasOfertas,
    getDetallePractica,
    getPracticasDisponibles,
    crearOferta,
    createVacant,
    updateVacant,
    deleteVacant,
    postularEstudiante
};