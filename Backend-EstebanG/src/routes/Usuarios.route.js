import { Router } from "express"
import  {actualizarUsuario, listarUsuarios, buscarUsuario, eliminarUsuario, registrarUsuarios} from '../controllers/Usuarios.controller.js'; 
//import { listarUsuarios, registrarUsuarios} from '../controllers/Usuarios.controller.js';
import {validarUsuario} from '../../validate/Usuariosvalidate.js'
import { validarToken } from "../controllers/autenticacion.js";

const rutaUsuario = Router();
    
// Listar usuarios: Solo los administradores pueden acceder a esta ruta
rutaUsuario.get('/listarUsuarios',validarToken,  listarUsuarios);

// Registrar usuario: No se requiere autenticación ya que es para registrar nuevos usuarios
rutaUsuario.post('/registrarUsuario', validarUsuario, registrarUsuarios);

// Desactivar usuario: Solo los administradores pueden acceder a esta ruta
rutaUsuario.delete('/eliminarUsuario/:identificacion', eliminarUsuario);

// Actualizar usuario: Solo los administradores pueden acceder a esta ruta
rutaUsuario.put('/actualizarUsuario/:identificacion', actualizarUsuario);

// Buscar usuario: Solo los administradores pueden acceder a esta ruta
rutaUsuario.get('/buscarUsuarios/:identificacion', buscarUsuario);
 

export default rutaUsuario; 
