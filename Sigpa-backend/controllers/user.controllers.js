const supabase = require("../models/bd");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 

const login = async (req, res) => {
    const { email, password } = req.body; 

    try {
        let user = null;
        let rol = '';

        // 1. Intentar buscar en la tabla de profesores (y administradores)
        const { data: teacher } = await supabase
            .from('teachers')
            .select('*')
            .eq('mail', email) 
            .maybeSingle();

        if (teacher) {
            user = teacher;
            rol = teacher.admin ? 'admin' : 'teacher';
        } else {
            // 2. Si no es profesor, intentar buscar en estudiantes
            const { data: student } = await supabase
                .from('students') 
                .select('*')
                .eq('mail', email) 
                .maybeSingle();

            if (student) {
                user = student;
                rol = 'student';
            } else {
                // 3. NUEVO: Si no es estudiante, intentar buscar en supervisores
                const { data: supervisor } = await supabase
                    .from('supervisors')
                    .select('*')
                    .eq('mail', email)
                    .maybeSingle();

                if (supervisor) {
                    user = supervisor;
                    rol = 'supervisor';
                }
            }
        }

        // Si después de buscar en las 3 tablas no hay usuario
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado en el sistema" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        
        const token = jwt.sign(
            { 
                id: user.id, 
                rol: rol, 
                university_id: user.universities_id || null
            }, 
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );


        res.json({ 
            token, 
            rol, 
            nombre: user.first_name 
        });

    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

module.exports = {  
    login 
};