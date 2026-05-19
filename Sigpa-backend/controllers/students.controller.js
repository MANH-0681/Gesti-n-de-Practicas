const supabase = require("../models/bd");
const bcrypt = require('bcrypt');

const createStudent = async (req, res) => {
    const { 
        first_name, 
        middle_name, 
        last_name, 
        second_last_name, 
        document_number, 
        mail, 
        cell_phone, 
        semester, 
        address, 
        careers_id, 
        document_types_id,
        password 
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const { data, error } = await supabase
            .from('students')
            .insert([
                { 
                    first_name, 
                    middle_name, 
                    last_name, 
                    second_last_name, 
                    document_number, 
                    mail, 
                    cell_phone, 
                    semester, 
                    address, 
                    careers_id, 
                    document_types_id,
                    password: hashedPassword
                }
            ])
            .select(); 

        if (error) throw error;

        res.status(201).json({ 
            message: 'Estudiante creado exitosamente en Supabase', 
            data: data[0] 
        });

    } catch (err) {
        res.status(500).json({ 
            mensaje: "Error al crear el estudiante en Supabase", 
            error: err.message 
        });
    }
};

const getStudents = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('students')
            .select(`first_name,middle_name,last_name,second_last_name,document_number,mail,cell_phone,address,semester,
                careers (
                    name
                ),
                document_types (
                    name
                )
            `)
            .eq('active', true)
            .is('deleted_at', null);

        if (error) throw error;

        res.status(200).json(data);

    } catch (err) {
        res.status(500).json({ 
            mensaje: "Error al obtener los estudiantes", 
            error: err.message 
        });
    }
};

const getStudentById = async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('students')
            .select(`first_name,middle_name,last_name,second_last_name,document_number,mail,cell_phone,address,semester,
                careers (
                    name
                ),
                document_types (
                    name
                )
            `)
            .eq('id', id)
            .eq('active', true)
            .is('deleted_at', null)
            .single();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ mensaje: "Estudiante no encontrado" });
        }

        // Construir fullName combinando los nombres
        const fullName = [data.first_name, data.middle_name, data.last_name, data.second_last_name]
            .filter(name => name) // Eliminar valores null/undefined
            .join(' ');

        const responseData = {
            ...data,
            fullName
        };

        res.status(200).json(responseData);

    } catch (err) {
        res.status(500).json({ 
            mensaje: "Error al obtener el estudiante", 
            error: err.message 
        });
    }
};

const getStudentPractices = async (req, res) => {
    const { id } = req.params; 

    try {
        const { data, error } = await supabase
            .from('practices') 
            .select(`
                *,
                students (
                    first_name,
                    last_name,
                    mail,
                    semester
                ),
                vacants (
                    title,
                    modalities ( name )
                ),
                teachers ( 
                    first_name, 
                    last_name,
                    mail 
                ),
                supervisors ( 
                    first_name, 
                    last_name, 
                    position 
                )
            `)
            .eq('students_id', id)
            .eq('active', true)
            .is('deleted_at', null);
        if (error) throw error;

        if (data.length === 0) {
            return res.status(404).json({ 
                mensaje: "No se encontraron prácticas para el estudiante con ID " + id 
            });
        }

        res.status(200).json(data);

    } catch (err) {
        res.status(500).json({ 
            mensaje: "Error al obtener las prácticas", 
            error: err.message 
        });
    }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;

  try {
    console.log(req.body);
    const { data, error } = await supabase
      .from('students')
      .update({
        first_name: req.body.first_name,
        middle_name: req.body.middle_name,
        last_name: req.body.last_name,
        second_last_name: req.body.second_last_name,
        mail: req.body.mail,
        cell_phone: req.body.cell_phone,
        address: req.body.address,
      })
      .eq('id', id)
      .select();

    if (error) {
      console.log(error);
      return res.status(500).json({
        error
      });
    }

    res.status(200).json({
      message: 'Estudiante actualizado correctamente',
      data: data[0]
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// Obtener TODOS los estudiantes sin restricciones (para administrador)
const getAllStudents = async (req, res) => {
    if (!req.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    try {
        const { data: students, error } = await supabase
            .from('students')
            .select('*, careers ( id, name ), document_types ( id, name )')
            .eq('active', true);

        if (error) throw error;

        res.json(students);

    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createStudent,
    getStudents,
    getStudentById,
    getStudentPractices,
    updateStudent,
    getAllStudents
};