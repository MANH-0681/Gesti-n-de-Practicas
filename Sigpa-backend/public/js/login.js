document.getElementById("form-login").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Por favor complete todos los campos.");
        return;
    }

    
    const loginData = { email, password };

    try {

        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // Avisamos que enviamos JSON
            },
            body: JSON.stringify(loginData) // Convertimos el objeto a texto
        });

        const data = await response.json(); // Express suele responder con JSON

        if (response.ok) {
            alert("Bienvenido");

            location.href = "dashboard.html";
        } else {

            alert(data.message || "Error al iniciar sesión");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor Express.");
    }
});