import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import bgBlue from '../assets/bg.svg';
import bgBack from '../assets/btn-back.svg';
import bgClose from '../assets/btn-close.svg';
import bgPetCamera from '../assets/photo-lg-1.svg';
import bgSelect from '../assets/arrows.svg';
import bgIconCamera from '../assets/icon-camera.svg';
import btnUpdate from '../assets/btn-update.svg';
import Swal from 'sweetalert2';


function ModificarMascota() {
    const { id_mascota } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        fk_id_raza: '',
        fk_id_categoria: '',
        fk_id_genero: '',
        foto: '',   
        fotoName: '' 
      });
      
    
    const [raza, setRaza] = useState([]);
    const [categoria, setCategoria] = useState([]);
    const [genero, setGenero] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const token = localStorage.getItem('token');

 useEffect(() => {
    const fetchMascota = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/BuscarMascota/${id_mascota}`, {
                headers: { token: token }
            });
            const { name, fk_id_raza, fk_id_categoria, foto, fk_id_genero } = response.data[0];
            setFormData({
                name: name || '',
                fk_id_raza: fk_id_raza || '',
                fk_id_categoria: fk_id_categoria || '',
                foto: foto || '',
                fk_id_genero: fk_id_genero || '',
                fotoName: foto || '' 
            });
              
            if (!formData.foto) {
                setPreviewImage(`http://localhost:3000/img/${foto}`);
                setSelectedImage(`http://localhost:3000/img/${foto}`);
            }// Establecer la URL de la imagen seleccionada
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
          setFormData(prevState => ({
            ...prevState,
            foto: file
          }));
          setSelectedImage(URL.createObjectURL(file)); // Actualizar la URL de la imagen seleccionada
        }
      };

      
      
      const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificar si algún campo está vacío
        const isFormEmpty = Object.values(formData).some(value => value === '');
        if (isFormEmpty) {
            // Mostrar alerta indicando que debe completar todos los campos
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Debe completar todos los campos',
            });
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('fk_id_raza', formData.fk_id_raza);
        formDataToSend.append('fk_id_categoria', formData.fk_id_categoria);
        formDataToSend.append('fk_id_genero', formData.fk_id_genero);
        
        // Si se seleccionó una nueva imagen, agregarla al formDataToSend
        if (formData.foto instanceof File) {
            formDataToSend.append('foto', formData.foto);
        } else {
            // Conservar la imagen original si no se seleccionó una nueva
            formDataToSend.append('foto', formData.fotoName);
        }
        
        try {
            const response = await axios.put(`http://localhost:3000/ActualizarMascota/${id_mascota}`, formDataToSend, {
                headers: {
                    'token': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Mascota actualizada con éxito:', response.data);

            Swal.fire({
                icon: 'success',
                title: 'Mascota actualizada con éxito',
                showConfirmButton: true, 
                timer: 1500
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/ListarM';
                }
            });
        } catch (error) {
            console.error('Error actualizando mascota:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';  
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
                    <img src={bgBack} alt="Close" className="cursor-pointer mb-20 mr-16" />
                </Link>
                <span className="text-gray-50 mb-20 text-xl">Modificar Mascota</span>
                <Link to="/">
                    <img src={bgClose} alt="Close" className="cursor-pointer mb-20 ml-12" onClick={handleLogout}/>
                </Link>
            </div>

            {selectedImage ? (
                    <img 
                             src={selectedImage} 
                                alt="Mascota" 
                                 className="cursor-pointer -mt-8 w-32 h-32 object-cover rounded-full"
                    />
            ) : previewImage ? (
                    <img 
                            src={previewImage} 
                                 alt="Mascota" 
                                    className="cursor-pointer -mt-8 w-32 h-32 object-cover rounded-full"
                    />
            ) : (
                    <img src={bgPetCamera} alt="Camera" className="cursor-pointer -mt-8" />
            )}


          
            <input
                type='text'
                id='name'
                value={formData.name}
                placeholder='Nombre'
                onChange={handleChange}
                name='name'
                className='bg-slate-400 px-3 text-gray-500 py-2 rounded-3xl border-gray-300 bg-transparent focus:outline-none ml-1 mt-8 placeholder-gray-500' 
                style={{ height: '40px', width: '350px',  backgroundColor:'rgba(206, 206, 206, 0.8)' }}
                required
            />

           

            <div className="relative mt-5" style={{color: '#717171'}}>
                <select
                    id='fk_id_raza'
                    value={formData.fk_id_raza}
                    onChange={handleChange}
                    name='fk_id_raza'
                    className='bg-slate-400 px-3 py-2 rounded-3xl border-gray-300 bg-transparent focus:outline-none ml-1 mb-1 placeholder-gray-500 appearance-none'
                    style={{ height: '40px', width: '355px', backgroundColor: 'rgba(206, 206, 206, 0.8)' }}
                    required
                >
                    <option value='' disabled style={{ color: 'rgba(128, 128, 128, 0.6)' }}>Seleccione Raza..</option>
                    {raza.map(razaItem => (
                        <option key={razaItem.id_raza} value={razaItem.id_raza}>{razaItem.nombre_raza}</option>
                    ))}
                </select>
                <img src={bgSelect} alt="Select" className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none" />
            </div>


          
            <div className="relative mt-5" style={{color: '#717171'}}>
                <select
                    id='fk_id_categoria'
                    value={formData.fk_id_categoria}
                    onChange={handleChange}
                    name='fk_id_categoria'
                    className='bg-slate-400 px-3 py-2 rounded-3xl border-gray-300 bg-transparent focus:outline-none ml-1 mb-1 placeholder-gray-500 appearance-none'
                    style={{ height: '40px', width: '355px', backgroundColor: 'rgba(206, 206, 206, 0.8)' }}
                    required
                >
                    <option value='' disabled style={{ color: 'rgba(128, 128, 128, 0.6)' }}>Seleccione Categoria..</option>
                    {categoria.map(categoriaItem => (
                        <option key={categoriaItem.id_categoria} value={categoriaItem.id_categoria}>{categoriaItem.tipo_categoria}</option>
                    ))}
                </select>
                <img src={bgSelect} alt="Select" className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none" />
            </div>

           

            <div className="relative">
            <label htmlFor="foto" className="bg-slate-400 px-3 py-2 rounded-3xl border-gray-300 bg-transparent focus:outline-none mt-4 placeholder-gray-500 cursor-pointer flex" style={{ width: '355px', backgroundColor: 'rgba(206, 206, 206, 0.8)', color: 'grey'}}>
                {formData.fotoName || 'Subir Foto'}
                <input
                 type='file' 
                 id='foto'
                onChange={handleFileChange}
                 name='foto'
                 className="hidden"
                required
                />
                </label>

                <img src={bgIconCamera} alt="Icon Camera" className="absolute right-4 transform -translate-y-1/2 top-9 pointer-events-none" />
            </div>


      
            <div className="relative mt-5" style={{color: '#717171'}}>
                <select
                    id='fk_id_genero'
                    value={formData.fk_id_genero}
                    onChange={handleChange}
                    name='fk_id_genero'
                    className='bg-slate-400 px-3 py-2 rounded-3xl border-gray-300 bg-transparent focus:outline-none ml-1 mb-1 placeholder-gray-500 appearance-none'
                    style={{ height: '40px', width: '355px', backgroundColor: 'rgba(206, 206, 206, 0.8)' }}
                    required
                >
                    <option value='' disabled style={{ color: 'rgba(128, 128, 128, 0.6)' }}>Seleccione Género..</option>
                 
                    {genero.map(generoItem => (
                        <option key={generoItem.id_genero} value={generoItem.id_genero}>{generoItem.tipo_generos}</option>
                    ))}
                </select>
                <img src={bgSelect} alt="Select" className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none" />
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

export default ModificarMascota;
