import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Importa useParams
import Sidebar from "../../components/supervisor/sidebar";
import FollowUpsTable from "../../components/supervisor/FollowUpsTable"; // Importa tu nueva tabla
import FollowUpModal from "../../components/supervisor/FollowUpModal";

const SeguimientosSupervisor = () => {
    const { practicaId } = useParams(); // Obtiene el ID de la URL
    const navigate = useNavigate();
    const [followUps, setFollowUps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedFollowUp, setSelectedFollowUp] = useState(null);

    const handleSave = async (formData) => {
    try {
        const token = localStorage.getItem('token');
        // Si hay un selectedFollowUp, usamos PUT para editar. Si no, POST para crear.
        const method = selectedFollowUp ? 'PUT' : 'POST';
        const url = selectedFollowUp 
            ? `${import.meta.env.VITE_API_URL}/follow-ups/${selectedFollowUp.id}` 
            : `${import.meta.env.VITE_API_URL}/follow-ups/`;

        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert(selectedFollowUp ? "Seguimiento actualizado" : "Seguimiento creado");
            setIsModalOpen(false);
            setSelectedFollowUp(null);
            window.location.reload(); 
        } else {
            // Verificar si la respuesta es realmente JSON antes de parsear
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const errorData = await response.json();
                alert("Error: " + (errorData.error || "Ocurrió un problema"));
            } else {
                // Si no es JSON, mostrar un error genérico o el texto plano
                alert(`Error del servidor: Recurso no encontrado o error interno (Status: ${response.status})`);
            }
        }
    } catch (error) {
        console.error("Error al guardar:", error);
        alert("Ocurrió un error al conectar con el servidor");
    }
};

    const handleDelete = async (id) => {
        const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este seguimiento? Esta acción no se puede deshacer.");
        
        if (confirmar) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/follow-ups/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    // Filtramos el estado para quitar el eliminado sin recargar la página
                    setFollowUps(followUps.filter(f => f.id !== id));
                    alert("Seguimiento eliminado correctamente.");
                }
            } catch (error) {
                console.error("Error al eliminar:", error);
            }
        }
    };

    const handleEditClick = (followUp) => {
        setSelectedFollowUp(followUp); // Guardamos los datos del que vamos a editar
        setIsModalOpen(true);
    };

    // FUNCIÓN PARA ABRIR EL MODAL EN MODO CREACIÓN
    const handleCreateClick = () => {
        setSelectedFollowUp(null); // Limpiamos por si había algo antes
        setIsModalOpen(true);
    };

    const handleCreateFollowUp = async (formData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/follow-ups/follow`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsModalOpen(false);
                // Aquí podrías recargar la lista de seguimientos para ver el nuevo
                window.location.reload(); 
            }
        } catch (error) {
            console.error("Error al crear seguimiento:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        const fetchSeguimientos = async () => {
            try {
                // Llamamos a tu API de seguimientos usando el ID de la práctica
                const response = await fetch(`${import.meta.env.VITE_API_URL}/follow-ups/${practicaId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const result = await response.json();
                    setFollowUps(result); // Guardamos la lista de seguimientos
                }
            } catch (error) {
                console.error("Error cargando seguimientos:", error);
            } finally {
                setLoading(false);
            }
        };

        if (practicaId) fetchSeguimientos();
    }, [practicaId]);

    if (loading) return <div className="loading-screen">Cargando seguimientos...</div>;

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <header className="contenedor-cabecera">
                    <div className="bloque-saludo">
                        <h1>Seguimientos</h1>
                    </div>
                </header>
                {/* contenido */}
		        <FollowUpsTable 
                    followUps={followUps} 
                    onCreate={() => setIsModalOpen(true)} // Abre el modal
                    onEdit={handleEditClick} // Edita el seguimiento
                    onDelete={handleDelete} // Elimina el seguimiento
                />
                
                <FollowUpModal 
                    isOpen={isModalOpen} 
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedFollowUp(null); // Limpiamos al cerrar
                    }} 
                    onSubmit={handleSave} // <--- Esta es la función que acabamos de definir
                    practicaId={practicaId}
                    initialData={selectedFollowUp}
                />
            </main>
        </div>
    );
}

export default SeguimientosSupervisor;