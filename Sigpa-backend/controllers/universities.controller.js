const supabase = require("../models/bd");
const getUniversities = async (req, res) => {
  const { data, error } = await supabase
    .from("universities")
    .select("id, name");

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

const getFacultiesByUniversity = async (req, res) => {
  const { universityId } = req.params;

  const { data, error } = await supabase
    .from("faculties")
    .select("id, name")
    .eq("universities_id", universityId)
    .eq("active", true);

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

const getCareersByFaculty = async (req, res) => {
  const { facultyId } = req.params;

  const { data, error } = await supabase
    .from("careers")
    .select("id, name")
    .eq("faculties_id", facultyId)
    .eq("active", true);

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

module.exports = {
  getUniversities,
  getFacultiesByUniversity,
  getCareersByFaculty
};