import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PracticesTable from '../../components/admin/PracticesTable';
import PracticesModal from '../../components/admin/PracticesModal';
import Sidebar from '../../components/admin/sidebar';

const Practicas = () => {
	const [practices, setPractices] = useState([]);
	const [open, setOpen] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ selectedPractice, setSelectedPractice ] = useState(null);
    const [ supervisors, setSupervisors ] = useState([]);
    const [ students, setStudents ] = useState([]);
    const [ teachers, setTeachers ] = useState([]);
    const [ vacants, setVacants ] = useState([]);

	const load = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL;

            const res = await fetch(`${apiUrl}/practices/allPractices`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setPractices(data);
            } else {
                console.error('Error cargando prácticas');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Cargar supervisores, estudiantes, docentes y vacantes
    const loadRelatedData = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL;

            const [supervisorRes, studentRes, teacherRes, vacantRes] = await Promise.all([
                fetch(`${apiUrl}/supervisors/allSupervisors`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch(`${apiUrl}/student/allStudents`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch(`${apiUrl}/teachers/allTeachers`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch(`${apiUrl}/vacants/allVacants`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            if (supervisorRes.ok) {
                const data = await supervisorRes.json();
                setSupervisors(data);
            }

            if (studentRes.ok) {
                const data = await studentRes.json();
                setStudents(data);
            }

            if (teacherRes.ok) {
                const data = await teacherRes.json();
                setTeachers(data);
            }

            if (vacantRes.ok) {
                const data = await vacantRes.json();
                setVacants(data);
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
            
            const method = selectedPractice ? 'PUT' : 'POST';
            const url = selectedPractice 
                ? `${apiUrl}/practices/updatePractice/${selectedPractice.id}`
                : `${apiUrl}/practices/createPractices`;

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
                setSelectedPractice(null);
                await load();
            } else {
                console.error('Error al guardar la práctica');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta práctica?");
    if (!confirmar) return;

    try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL;

        const res = await fetch(`${apiUrl}/practices/deletePractice/${id}`, {
            method: 'PUT', 
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            await load(); 
        } else {
            console.error('Error eliminando la práctica');
            alert('No se pudo eliminar la práctica.');
        }
    } catch (err) {
        console.error(err);
    }
};

    const handleEditClick = (practice) => {
        setSelectedPractice(practice);
        setIsModalOpen(true);
    };

    const handleCreateClick = () => {
        setSelectedPractice(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPractice(null);
    };

    if (loading) {
        return <div style={{ padding: '20px' }}>Cargando Practicas...</div>;
    }

	return (
		<div className="dashboard-layout">
			<Sidebar />
            <main className="main-content" style={{ flex: 1, padding: '20px' }}>
                <header className="contenedor-cabecera" style={{ marginBottom: '20px' }}>
                    <div className="bloque-saludo">
                        <h1>Practicas</h1>
                    </div>
                </header>
				<PracticesTable 
					practices={practices} 
					onEdit={handleEditClick} 
					onDelete={handleDelete}
					onCreate={handleCreateClick}
				/>
                <PracticesModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSave}
                    initialData={selectedPractice}
                    supervisors={supervisors}
                    students={students}
                    teachers={teachers}
                    vacants={vacants}
                />
			</main>
		</div>
	);
};

export default Practicas;
