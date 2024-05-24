import { pool } from '../database/conexion.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

export const registrarUsuarios = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { identificacion, nombre, email, password } = req.body;

        // Verificar si el email ya está en uso
        const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        // Encriptar la contraseña antes de almacenarla
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            'INSERT INTO usuarios (identificacion, nombre, email, password) VALUES (?, ?, ?, ?)',
            [identificacion, nombre, email, hashedPassword]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Usuario registrado exitosamente.' });
        } else {
            return res.status(500).json({ message: 'No se pudo registrar el usuario.' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error del servidor: ' + error.message });
    }
};

export const listarUsuarios = async (req, res) => {
    try {
        // Consultar la base de datos para obtener la lista de todos los usuarios
        const [result] = await pool.query('SELECT * FROM usuarios');

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                status: 404,
                message: 'No se encontraron usuarios registrados'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error en el sistema',
            error: error.message
        });
    }
};

export const actualizarUsuario = async (req, res) => {
    try {
        const { identificacion } = req.params;
        const { nombre, correo, password } = req.body;

        // Actualizar los datos del usuario en la base de datos
        const [result] = await pool.query('UPDATE usuarios SET nombre = ?, correo = ?, password = ? WHERE identificacion = ?', [nombre, correo, password, identificacion]);

        if (result.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                message: 'Usuario actualizado correctamente'
            });
        } else {
            res.status(404).json({
                status: 404,
                message: 'No se encontró ningún usuario con esa identificación'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};


export const eliminarUsuario = async (req, res) => {
    try {
        const { identificacion } = req.params;

        // Eliminar el usuario de la base de datos
        const [result] = await pool.query('DELETE FROM usuarios WHERE identificacion = ?', [identificacion]);

        if (result.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                message: 'Usuario eliminado correctamente'
            });
        } else {
            res.status(404).json({
                status: 404,
                message: 'No se encontró ningún usuario con esa identificación'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

export const buscarUsuario = async (req, res) => {
    try {
        const { identificacion } = req.params;

        // Buscar el usuario por identificación en la base de datos
        const [result] = await pool.query('SELECT * FROM usuarios WHERE identificacion = ?', [identificacion]);

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                status: 404,
                message: 'No se encontró ningún usuario con esa identificación'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};


