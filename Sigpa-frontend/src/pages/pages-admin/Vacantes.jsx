import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VacantsTable from '../../components/admin/VacantsTable';
import VacantsModal from '../../components/admin/VacantsModal';
import Sidebar from '../../components/admin/sidebar';

const Vacantes = () => {
	const [vacants, setVacants] = useState([]);
	const [open, setOpen] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ selectedVacant, setSelectedVacant ] = useState(null);
    const [ businesses, setBusinesses ] = useState([]);
    const [ modalities, setModalities ] = useState([]);
    const [ timeModalities, setTimeModalities ] = useState([]);

	const load = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL;

            const res = await fetch(`${apiUrl}/vacants/allVacants`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setVacants(data);
            } else {
                console.error('Error cargando vacantes');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Cargar empresas, modalidades y modalidades de tiempo
    const loadRelatedData = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL;

            const [businessRes, modalityRes, timeModalityRes] = await Promise.all([
                fetch(`${apiUrl}/businesses/allBusinesses`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch(`${apiUrl}/modalities/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch(`${apiUrl}/timeModalities/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            if (businessRes.ok) {
                const data = await businessRes.json();
                setBusinesses(data);
            }

            if (modalityRes.ok) {
                const data = await modalityRes.json();
                setModalities(data);
            }

            if (timeModalityRes.ok) {
                const data = await timeModalityRes.json();
                setTimeModalities(data);
            }
        } catch (err) {
            console.error('Error cargando datos relacionados:', err);
        }
    };

	useEffect(() => { 
        load();
        loadRelatedData();
    }, []);

    const handleSave = async (formData) => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL;
            
            const method = selectedVacant ? 'PUT' : 'POST';
            const url = selectedVacant 
                ? `${apiUrl}/vacants/updateVacant/${selectedVacant.id}`
                : `${apiUrl}/vacants/createVacant`;

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsModalOpen(false);
                setSelectedVacant(null);
                await load();
            } else {
                console.error('Error al guardar la vacante');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta vacante?");
    if (!confirmar) return;

    try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL;

        const res = await fetch(`${apiUrl}/vacants/deleteVacant/${id}`, {
            method: 'PUT', 
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            await load(); 
        } else {
            console.error('Error eliminando la vacante');
            alert('No se pudo eliminar la vacante.');
        }
    } catch (err) {
        console.error(err);
    }
};

    const handleEditClick = (vacant) => {
        setSelectedVacant(vacant);
        setIsModalOpen(true);
    };

    const handleCreateClick = () => {
        setSelectedVacant(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedVacant(null);
    };

    if (loading) {
        return <div style={{ padding: '20px' }}>Cargando vacantes...</div>;
    }

	return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content" style={{ flex: 1, padding: '20px' }}>
                <header className="contenedor-cabecera" style={{ marginBottom: '20px' }}>
                    <div className="bloque-saludo">
                        <h1>Vacantes</h1>
                    </div>
                </header>

                <VacantsTable
                    vacants={vacants}
                    onEdit={handleEditClick}
                    onDelete={handleDelete}
                    onCreate={handleCreateClick}
                />
                <VacantsModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSave}
                    initialData={selectedVacant}
                    businesses={businesses}
                    modalities={modalities}
                    timeModalities={timeModalities}
                />
            </main>
        </div>
    );
};

export default Vacantes;
