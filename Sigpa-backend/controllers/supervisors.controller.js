const supabase = require('../models/bd'); 
const bcrypt = require('bcrypt');

// --- Función para el Dashboard del Supervisor ---
const getSupervisorDashboardData = async (req, res) => {
    // El ID viene del middleware de autenticación (auth.js)
    const supervisorId = req.usuario.id; 

    try {
        // 1. Obtener información del supervisor y su empresa
        const { data: supervisorInfo, error: supervisorError } = await supabase
            .from('supervisors')
            .select(`
                *,
                businesses (
                    company_name,
                    nit,
                    city,
                    sector,
                    website,
                    address,
                    cell_phone,
                    mail
                )
            `)
            .eq('id', supervisorId)
            .single();

        if (supervisorError) throw supervisorError;

        // 2. Obtener las prácticas activas con datos de Estudiantes, Seguimientos y Modalidad de la Vacante
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
                ),
                vacants (
                  title,
                  modalities ( name ),
                  time_modalities ( name )
                ),
                follow_ups (
                    id,
                    progress,
                    created_at
                )
            `)
            .eq('supervisors_id', supervisorId)
            .is('deleted_at', null);

        if (practicesError) throw practicesError;

        // 3. Calcular métricas en el servidor para facilitar el trabajo al Frontend
        const metrics = {
            totalStudents: practices.length,
            activePractices: practices.filter(p => p.active).length,
            pendingFollowUps: practices.reduce((acc, p) => {
                // Contamos seguimientos que no estén 'completados' o 'aprobados'
                const pending = p.follow_ups.filter(f => f.status !== 'completed').length;
                return acc + pending;
            }, 0)
        };

        return res.status(200).json({
            supervisor: supervisorInfo,
            statistics: metrics,
            studentsList: practices
        });

    } catch (error) {
        console.error("Error en Dashboard Supervisor:", error);
        return res.status(500).json({ 
            message: "Error al cargar los datos del dashboard",
            error: error.message 
        });
    }
};

const createSupervisor = async (req, res) => {
    const { 
        first_name, 
        middle_name, 
        last_name, 
        second_last_name, 
        document_number, 
        mail, 
        cell_phone, 
        position, 
        document_types_id, 
        businesses_id,
        password
    } = req.body;
       
    if (!first_name || !last_name || !document_number || !mail || !cell_phone || !position || !businesses_id || !password) {
        return res.status(400).json({ message: "Faltan campos obligatorios para el supervisor" });
    }

    try {

        const hashedPassword = await bcrypt.hash(password, 10);
        const { data, error } = await supabase
            .from('supervisors')
            .insert([
                { 
                    first_name, 
                    middle_name, 
                    last_name, 
                    second_last_name, 
                    document_number, 
                    mail, 
                    cell_phone, 
                    position, 
                    document_types_id: parseInt(document_types_id), 
                    businesses_id: parseInt(businesses_id),
                    password: hashedPassword
                }
            ])
            .select();

        if (error) throw error;

        return res.status(201).json({
            message: "Supervisor creado con éxito",
            data: data[0]
        });

    } catch (error) {
        console.error("Error al crear supervisor:", error);
        return res.status(500).json({ 
            message: "Error interno del servidor", 
            error: error.message 
        });
    }
};
const getSupervisorsByUniversity = async (req, res) => {
  if (!req.usuario) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {

    const { data: docente } = await supabase
      .from('teachers')
      .select('id, universities_id')
      .eq('id', req.usuario.id)
      .single();

    if (!docente) {
      return res.status(403).json({ error: 'Usuario no válido' });
    }

    const universities_id = docente.universities_id;

    const { data: teachers } = await supabase
      .from('teachers')
      .select('id')
      .eq('universities_id', universities_id);

    const teacherIds = cleanIds(teachers.map(t => t.id));

    if (teacherIds.length === 0) {
      return res.json([]);
    }

    console.log("teacherIds vinculados a la universidad:", teacherIds);

    const { data: practices } = await supabase
      .from('practices')
      .select('supervisors_id')
      .in('teachers_id', teacherIds);

    const supervisorIds = cleanIds(practices.map(p => p.supervisors_id));

    if (supervisorIds.length === 0) {
      return res.json([]);
    }

    console.log("supervisorIds encontrados en prácticas:", supervisorIds);

    const { data: supervisors, error } = await supabase
      .from('supervisors')
      .select(`
        *,
        businesses (
          company_name
        )
      `)
      .in('id', supervisorIds);

    if (error) throw error;

    res.json(supervisors);

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener TODOS los supervisores sin restricciones (para administrador)
const getAllSupervisors = async (req, res) => {
    if (!req.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    try {
        const { data: supervisors, error } = await supabase
            .from('supervisors')
            .select('*, businesses ( id, company_name )')
            .eq('active', true);

        if (error) throw error;

        res.json(supervisors);

    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

// Actualizar supervisor
const updateSupervisor = async (req, res) => {
    const { id } = req.params;
    const { 
        first_name, 
        middle_name, 
        last_name, 
        second_last_name, 
        document_number, 
        mail, 
        cell_phone, 
        position, 
        document_types_id, 
        businesses_id 
    } = req.body;

    try {
        const { data, error } = await supabase
            .from('supervisors')
            .update({
                first_name,
                middle_name,
                last_name,
                second_last_name,
                document_number,
                mail,
                cell_phone,
                position,
                document_types_id,
                businesses_id
            })
            .eq('id', id)
            .select();

        if (error) throw error;

        return res.json({
            message: "Supervisor actualizado con éxito",
            data: data[0]
        });
    } catch (error) {
        console.error("Error al actualizar supervisor:", error);
        return res.status(500).json({ 
            message: "Error interno del servidor", 
            error: error.message 
        });
    }
};

module.exports = { createSupervisor, getSupervisorsByUniversity, getSupervisorDashboardData, getAllSupervisors, updateSupervisor };