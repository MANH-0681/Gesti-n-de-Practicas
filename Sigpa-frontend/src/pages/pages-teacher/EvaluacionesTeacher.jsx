import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/teacher/sidebar";
import EvaluationsTable from "../../components/teacher/EvaluationsTable";
import EvaluationsModal from "../../components/teacher/EvaluationsModal";

const EvaluacionesTeacher = () => {
    const { practicaId } = useParams(); 
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvaluation, setSelectedEvaluation] = useState(null);

    const fetchEvaluations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/evaluations/practice/${practicaId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setEvaluations(data);
            }
        } catch (error) {
            console.error("Error al traer evaluaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (practicaId) fetchEvaluations();
    }, [practicaId]);

    const handleSave = async (formData) => {
        try {
            const token = localStorage.getItem('token');
            const method = selectedEvaluation ? 'PUT' : 'POST';
            const url = selectedEvaluation 
                ? `${import.meta.env.VITE_API_URL}/evaluations/${selectedEvaluation.id}` 
                : `${import.meta.env.VITE_API_URL}/evaluations/`;

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsModalOpen(false);
                setSelectedEvaluation(null);
                fetchEvaluations(); // Refrescar tabla
            }
        } catch (error) {
            console.error("Error al guardar evaluación:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta evaluación?")) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/evaluations/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchEvaluations();
            }
        } catch (error) {
            console.error("Error al eliminar evaluación:", error);
        }
    };

    const handleEditClick = (evaluation) => {
        setSelectedEvaluation(evaluation);
        setIsModalOpen(true);
    };

    if (loading) return <div className="loading-screen">Cargando evaluaciones...</div>;

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content" style={{ flex: 1, padding: '20px' }}>
                <header className="contenedor-cabecera" style={{ marginBottom: '20px' }}>
                    <div className="bloque-saludo">
                        <h1>Evaluaciones del Estudiante</h1>
                    </div>
                </header>
                
                <EvaluationsTable 
                    evaluations={evaluations} 
                    onCreate={() => { setSelectedEvaluation(null); setIsModalOpen(true); }} 
                    onEdit={handleEditClick} 
                    onDelete={handleDelete} 
                />
                
                <EvaluationsModal 
                    isOpen={isModalOpen} 
                    onClose={() => { setIsModalOpen(false); setSelectedEvaluation(null); }} 
                    onSubmit={handleSave} 
                    practicaId={practicaId}
                    initialData={selectedEvaluation}
                />
            </main>
        </div>
    );
};

export default EvaluacionesTeacher;