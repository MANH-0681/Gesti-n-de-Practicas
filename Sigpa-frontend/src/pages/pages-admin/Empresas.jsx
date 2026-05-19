import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BusinessesTable from '../../components/admin/BusinessesTable';
import BusinessesModal from '../../components/admin/BusinessesModal';
import Sidebar from '../../components/admin/sidebar';

const Empresas = () => {
	const [businesses, setBusinesses] = useState([]);
	const [open, setOpen] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ selectedBusiness, setSelectedBusiness ] = useState(null);

	const load = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL;

            const res = await fetch(`${apiUrl}/businesses/allBusinesses`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setBusinesses(data);
            } else {
                console.error('Error cargando empresas');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false); // <--- AGREGA ESTO AQUÍ
        }
    };

	useEffect(() => { load(); }, []);

    const handleSave = async (formData) => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL;
            
            // Si hay una empresa seleccionada, es PUT a la ruta con su ID, si no, es POST
            const method = selectedBusiness ? 'PUT' : 'POST';
            const url = selectedBusiness 
                ? `${apiUrl}/businesses/updateBusiness/${selectedBusiness.id}`
                : `${apiUrl}/businesses/createBusinesses`;

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
                setSelectedBusiness(null);
                await load(); // Recargamos la tabla con los datos nuevos
            } else {
                console.error('Error al guardar la empresa');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta empresa?");
    if (!confirmar) return;

    try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL;


        const res = await fetch(`${apiUrl}/businesses/deleteBusiness/${id}`, {
            method: 'PUT', 
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            await load(); 
        } else {
            console.error('Error eliminando la empresa');
            alert('No se pudo eliminar la empresa.');
        }
    } catch (err) {
        console.error(err);
    }
};

    const handleEditClick = (business) => {
        setSelectedBusiness(business);
        setIsModalOpen(true);
    }

    if (loading) {
        return <div style={{ padding: '20px' }}>Cargando empresas...</div>;
    }

	return (
		<div className="dashboard-layout">
            <Sidebar />
            <main className="main-content" style={{ flex: 1, padding: '20px' }}>
                <header className="contenedor-cabecera" style={{ marginBottom: '20px' }}>
                    <div className="bloque-saludo">
                        <h1>Empresas</h1>
                    </div>
                </header>
                
                <BusinessesTable 
                    businesses={businesses} 
                    onCreate={() => { setSelectedBusiness(null); setIsModalOpen(true); }} 
                    onEdit={handleEditClick} 
                    onDelete={handleDelete} 
                />
                
                <BusinessesModal 
                    isOpen={isModalOpen} 
                    onClose={() => { setIsModalOpen(false); setSelectedBusiness(null); }} 
                    onSubmit={handleSave} 
                    initialData={selectedBusiness}
                />
            </main>
        </div>
	);
};

export default Empresas;
