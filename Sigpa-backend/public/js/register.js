document.addEventListener("DOMContentLoaded", () => {

    const uniSelect = document.getElementById("university");
    const facultySelect = document.getElementById("faculty");
    const careerSelect = document.getElementById("career");

    // 🔹 1. Cargar universidades al iniciar
    async function loadUniversities() {
        try {
            const res = await fetch("http://localhost:3000/api/universities");
            const data = await res.json();
            
            uniSelect.innerHTML = '<option value="">Seleccione universidad</option>';
            data.forEach(u => {
                const option = document.createElement("option");
                option.value = u.id;
                option.textContent = u.name;
                uniSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error cargando universidades:", error);
        }
    }

    loadUniversities();

    // 🔹 2. Universidad → Facultades
    uniSelect.addEventListener("change", async (e) => {
        const universityId = e.target.value;

        facultySelect.innerHTML = '<option value="">Seleccione facultad</option>';
        careerSelect.innerHTML = '<option value="">Seleccione carrera</option>';

        facultySelect.disabled = true;
        careerSelect.disabled = true;

        if (!universityId) return;

        try {
            const res = await fetch(`http://localhost:3000/api/universities/${universityId}/faculties`);
            const data = await res.json();

            data.forEach(f => {
                const option = document.createElement("option");
                option.value = f.id;
                option.textContent = f.name;
                facultySelect.appendChild(option);
            });

            facultySelect.disabled = false;
        } catch (error) {
            console.error("Error cargando facultades:", error);
        }
    });

    // 🔹 3. Facultad → Carreras
    facultySelect.addEventListener("change", async (e) => {
        const facultyId = e.target.value;
        const universityId = uniSelect.value; 

        careerSelect.innerHTML = '<option value="">Seleccione carrera</option>';
        careerSelect.disabled = true;

        if (!facultyId || !universityId) return;

        try {
          
            const res = await fetch(`http://localhost:3000/api/universities/faculties/${facultyId}/careers`);
            const data = await res.json();

            data.forEach(c => {
                const option = document.createElement("option");
                option.value = c.id;
                option.textContent = c.name;
                careerSelect.appendChild(option);
            });

            careerSelect.disabled = false;
        } catch (error) {
            console.error("Error cargando carreras:", error);
        }
    });

    // 🔹 Submit
    document.getElementById("form-register").addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("reg-email").value.trim();
        const pass1 = document.getElementById("reg-password").value;
        const pass2 = document.getElementById("reg-password2").value;

        const first_name = document.getElementById("first_name").value.trim();
        const middlel_name = document.getElementById("middle_name").value.trim();
        const last_name = document.getElementById("last_name").value.trim();
        const second_last_name = document.getElementById("second_last_name").value.trim();
        const document_number = document.getElementById("document_number").value.trim();
        const cell_phone = document.getElementById("cell_phone").value.trim();
        const semester = parseInt(document.getElementById("semester").value);
        const address = document.getElementById("address").value.trim();
        const careers_id = parseInt(document.getElementById("career").value);

        if (!email || !pass1 || !pass2 || !first_name || !last_name || !document_number) {
            alert("Todos los campos obligatorios deben llenarse.");
            return;
        }

        if (!careers_id) {
            alert("Debes seleccionar una carrera");
            return;
        }

        if (pass1 !== pass2) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const body = {
            first_name,
            middle_name,
            last_name,
            second_last_name,
            document_number,
            mail: email,
            cell_phone,
            semester,
            address,
            careers_id,
            document_types_id:1,
            password: pass1
        };

        try {
            const response = await fetch("http://localhost:3000/api/student/Createstudents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Cuenta creada con éxito");
            } else {
                alert(data.mensaje || "Error al crear usuario");
            }

        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor");
        }
    });

});