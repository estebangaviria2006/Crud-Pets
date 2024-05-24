import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import bgBlue from '../assets/bg.svg';
import bgBack from '../assets/btn-back.svg';
import bgClose from '../assets/btn-close.svg';
import bgPetCamera from '../assets/photo-lg-1.svg';
import { useNavigate } from 'react-router-dom';
import bgSelect from '../assets/arrows.svg';
import bgIconCamera from '../assets/icon-camera.svg';
import Swal from 'sweetalert2';
import btnUpdate from '../assets/btn-update.svg';

function ModificarM() {
    const { id_mascota } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        fk_id_raza: '',
        fk_id_categoria: '',
        fk_id_genero: '',
        foto: '',
    });

    const [pet, setPet] = useState(null);
    const [raza, setRaza] = useState([]);
    const [categoria, setCategoria] = useState([]);
    const [genero, setGenero] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [nombre, setNombre] = useState([]);

    useEffect(() => {
        const fetchMascota = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/BuscarMascota/${id_mascota}`, {
                    headers: { token: token }
                });
                const { name, id_raza, id_categoria, foto, id_genero } = response.data;
                setFormData({
                    name: name || '',
                    fk_id_raza: id_raza || '',
                    fk_id_categoria: id_categoria || '',
                    foto: foto || '',
                    fk_id_genero: id_genero || '',
                });
                const mascota = response.data.map((item) => ({
                    nombre: item.name,
                    value: item.id_mascota,
                    foto: item.foto,
                    genero: item.genero,
                    categoria: item.categoria,
                    raza: item.raza
                }));
                setNombre(mascota);
                setPreviewImage(`http://localhost:3000/img/${foto}`);
            } catch (error) {
                console.error('Error al obtener los datos de la mascota:', error);
            }
        };
        fetchMascota();
    }, [id_mascota, token]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [razaResponse, categoriaResponse, generoResponse] = await Promise.all([
                    axios.get('http://localhost:3000/listaraza', { headers: { token: token } }),
                    axios.get('http://localhost:3000/listarCategoria', { headers: { token: token } }),
                    axios.get('http://localhost:3000/listarGenero', { headers: { token: token } })
                ]);
                setRaza(razaResponse.data);
                setCategoria(categoriaResponse.data);
                setGenero(generoResponse.data);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
        fetchData();
    }, [token]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.type.startsWith('image/')) {
                setFormData(prevState => ({
                    ...prevState,
                    foto: file
                }));
                setPreviewImage(URL.createObjectURL(file));
            } else {
                console.error('El archivo seleccionado no es una imagen.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isFormValid = Object.values(formData).every(value => value !== '');
        if (!isFormValid) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Por favor, debe completar todos los campos del formulario',
            });
            return;
        }
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('fk_id_raza', formData.fk_id_raza);
        formDataToSend.append('fk_id_categoria', formData.fk_id_categoria);
        formDataToSend.append('fk_id_genero', formData.fk_id_genero);
        if (formData.foto instanceof File) {
            formDataToSend.append('foto', formData.foto);
        }
        try {
            const response = await axios.put(`http://localhost:3000/ActualizarMascota/${id_mascota}`, formDataToSend, {
                headers: {
                    'token': token,
                }
            });
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Mascota actualizada exitosamente.',
            }).then(() => {
                navigate('/ListarM');
            });
        } catch (error) {
            console.error('Error actualizando mascota:', error);
        }
    };

    return (
        <div
            className='flex flex-col items-center justify-center min-h-screen'
            style={{
                backgroundImage: `url(${bgBlue})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                paddingBottom: '1vh'
            }}
        >
            <div className="flex items-center">
                <Link to="/ListarM">
                    <img src={bgBack} alt="Back" className="mb-20 mr-16 cursor-pointer" />
                </Link>
                <span className="mb-20 text-xl text-gray-50">Modificar Mascota</span>
                <Link to="/">
                    <img src={bgClose} alt="Close" className="mb-20 ml-12 cursor-pointer" />
                </Link>
            </div>

            {previewImage ? (
                <img
                    src={`http://localhost:3000/img/${nombre[0]?.foto}`}
                    alt="Mascota"
                    className="object-cover w-32 h-32 -mt-8 rounded-full cursor-pointer"
                />
            ) : (
                <img src={bgPetCamera} alt="Camera" className="-mt-8 cursor-pointer" />
            )}

<input
                type='text'
                id='name'
                value={formData.name || nombre[0]?.nombre || ''}
                onChange={handleChange}
                name='name'
                className='px-3 py-2 mt-8 ml-1 bg-transparent border-gray-300 bg-slate-400 rounded-3xl focus:outline-none'
                style={{ height: '40px', width: '350px', backgroundColor: 'rgba(206, 206, 206, 0.8)' }}
                required
            />

            <div className="relative mt-5" style={{ color: '#717171' }}>
                <select
                    id='fk_id_raza'
                    value={formData.fk_id_raza}
                    onChange={handleChange}
                    name='fk_id_raza'
                    className='px-3 py-2 mb-1 ml-1 placeholder-gray-500 bg-transparent border-gray-300 appearance-none bg-slate-400 rounded-3xl focus:outline-none'
                    style={{ height: '40px', width: '355px', backgroundColor: 'rgba(206, 206, 206, 0.8)' }}
                    required
                >
                    {raza.map(razaItem => (
                        <option key={razaItem.id_raza} value={razaItem.id_raza}>{razaItem.nombre_raza}</option>
                    ))}
                </select>
                <img src={bgSelect} alt="Select" className="absolute transform -translate-y-1/2 pointer-events-none top-1/2 right-4" />
            </div>

            <div className="relative mt-5" style={{ color: '#717171' }}>
                <select
                    id='fk_id_categoria'
                    value={formData.fk_id_categoria}
                    onChange={handleChange}
                    name='fk_id_categoria'
                    className='px-3 py-2 mb-1 ml-1 placeholder-gray-500 bg-transparent border-gray-300 appearance-none bg-slate-400 rounded-3xl focus:outline-none'
                    style={{ height: '40px', width: '355px', backgroundColor: 'rgba(206, 206, 206, 0.8)' }}
                    required
                >
                    {categoria.map(categoriaItem => (
                        <option key={categoriaItem.id_categoria} value={categoriaItem.id_categoria}>{categoriaItem.tipo_categoria}</option>
                    ))}
                </select>
                <img src={bgSelect} alt="Select" className="absolute transform -translate-y-1/2 pointer-events-none top-1/2 right-4" />
            </div>

            <div className="relative">
                <label htmlFor="foto" className="flex px-3 py-2 mt-4 placeholder-gray-500 bg-transparent border-gray-300 cursor-pointer bg-slate-400 rounded-3xl focus:outline-none" style={{ width: '355px', backgroundColor: 'rgba(206, 206, 206, 0.8)', color: 'grey' }}>
                    {formData.foto ? formData.foto.name : 'Subir Foto'}
                    <input
                        type='file'
                        id='foto'
                        onChange={handleFileChange}
                        name='foto'
                        className="hidden"
                        required
                    />
                </label>
                <img src={bgIconCamera} alt="Icon Camera" className="absolute transform -translate-y-1/2 pointer-events-none top-9 right-4" />
            </div>

            <div className="relative mt-5" style={{ color: '#717171' }}>
                <select
                    id='fk_id_genero'
                    value={formData.fk_id_genero}
                    onChange={handleChange}
                    name='fk_id_genero'
                    className='px-3 py-2 mb-1 ml-1 placeholder-gray-500 bg-transparent border-gray-300 appearance-none bg-slate-400 rounded-3xl focus:outline-none'
                    style={{ height: '40px', width: '355px', backgroundColor: 'rgba(206, 206, 206, 0.8)' }}
                    required
                >
                    {genero.map(generoItem => (
                        <option key={generoItem.id_genero} value={generoItem.id_genero}>{generoItem.tipo_generos}</option>
                    ))}
                </select>
                <img src={bgSelect} alt="Select" className="absolute transform -translate-y-1/2 pointer-events-none top-1/2 right-4" />
            </div>

            <button
                type="submit"
                onClick={handleSubmit}
                className="mt-10"
            >
                <img src={btnUpdate} alt="Update" />
            </button>
        </div>
    );
}

export default ModificarM;
