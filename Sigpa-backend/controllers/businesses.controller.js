const supabase = require("../models/bd");

const getAllCompanies = async (req, res) => {
  if (!req.usuario) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    // Traemos absolutamente todas las empresas de la base de datos
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('active', true);

    if (error) throw error;

    res.json(businesses);

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

const createCompany = async (req, res) => {
    const { 
        company_name, 
        nit, 
        address, 
        cell_phone, 
        mail, 
        city, 
        sector, 
        website, 
        document_types_id 
    } = req.body;

    try {
        const { data, error } = await supabase
            .from('businesses')
            .insert([
                { 
                    company_name, 
                    nit, 
                    address, 
                    cell_phone,
                    mail,
                    city,
                    sector,
                    website, 
                    document_types_id,

                }
            ])
            .select();

        if (error) throw error;


        return res.status(201).json({
            message: "Empresa creada globalmente con éxito",
            data: data[0]
        });

    } catch (error) {
        console.error("Error al crear empresa:", error);
        return res.status(500).json({ 
            message: "Error interno del servidor", 
            error: error.message 
        });
    }
};


const cleanIds = (arr) => {
  return [...new Set(
    arr.filter(id => id !== null && id !== undefined)
  )];
};

const getCompanies = async (req, res) => {
  if (!req.usuario) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {

    const { data: docente } = await supabase
      .from('teachers')
      .select('id, universities_id')
      .eq('id', req.usuario.id)
      .eq('active', true)
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

    console.log("teacherIds:", teacherIds);


    const { data: practices } = await supabase
      .from('practices')
      .select('supervisors_id')
      .in('teachers_id', teacherIds);
      console.log("practices:", practices);
    const supervisorIds = cleanIds(practices.map(p => p.supervisors_id));

    if (supervisorIds.length === 0) {
      return res.json([]);
    }

    console.log("supervisorIds:", supervisorIds);

  
    const { data: supervisors } = await supabase
      .from('supervisors')
      .select('businesses_id')
      .in('id', supervisorIds);
      console.log("supervisors:", supervisors);
    const businessIds = cleanIds(supervisors.map(s => s.businesses_id));

    if (businessIds.length === 0) {
      return res.json([]);
    }

    console.log("businessIds:", businessIds);

    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('*')
      .in('id', businessIds)
      .eq('active', true);

    if (error) throw error;

    res.json(businesses);

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateCompany = async (req, res) => {
  const { id } = req.params; // Capturamos el ID de la empresa de la URL
  const { company_name, nit, address, cell_phone, mail, city, sector, website } = req.body;

  try {
    const { data, error } = await supabase
      .from('businesses')
      .update({ company_name, nit, address, cell_phone, mail, city, sector, website })
      .eq('id', id)
      .select();

    if (error) throw error;

    return res.json({
      message: "Empresa actualizada con éxito",
      data: data[0]
    });
  } catch (error) {
    console.error("Error al actualizar empresa:", error);
    return res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};

const deleteCompany = async (req, res) => {
  const { id } = req.params;

  try {
    // En lugar de un .delete(), hacemos un .update() cambiando el estado a false
    const { data, error } = await supabase
      .from('businesses')
      .update({ active: false }) 
      .eq('id', id)
      .select();

    if (error) throw error;

    return res.json({
      message: "Empresa eliminada de forma lógica con éxito",
      data: data[0]
    });
  } catch (error) {
    console.error("Error en soft delete de empresa:", error);
    return res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};

module.exports = {
    createCompany,
    getCompanies,
    getAllCompanies,
    updateCompany,
    deleteCompany
};