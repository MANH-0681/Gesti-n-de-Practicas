const db = require("../models/bd");

// =========================
// OBTENER PENDIENTES
// =========================

const getEarrings = async (req, res) => {

  const usuarioId = req.usuario.id;

  try {

    const { data, error } = await db
      .from("earrings")
      .select("*")
      .eq("students_id", usuarioId)
      .eq("active", true)
      .is("deleted_at", null)
      .order("created_at", {
        ascending: false
      });

    if (error) throw error;

    res.json(data);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });
  }
};

// =========================
// CREAR
// =========================

const createEarring = async (req, res) => {

  const usuarioId = req.usuario.id;

  const { description } = req.body;

  try {

    console.log("USUARIO:", usuarioId);

    const { data, error } = await db
      .from("earrings")
      .insert([
        {
          description,
          students_id: Number(usuarioId),
          active: true
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);

  } catch (error) {

    console.log("ERROR CREANDO:", error);

    res.status(500).json({
      error: error.message
    });
  }
};

// =========================
// ELIMINAR (SOFT DELETE)
// =========================

const deleteEarring = async (req, res) => {

  const { id } = req.params;

  try {

    const { error } = await db
      .from("earrings")
      .update({
        active: false,
        deleted_at: new Date()
      })
      .eq("id", id);

    if (error) throw error;

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
};

module.exports = {
  getEarrings,
  createEarring,
  deleteEarring
};