import { pool } from "../database/conexion.js";
import { validationResult } from 'express-validator';

//crud listar
export const listarR = async (req, res) => {
    try {
        // Obtener el admin_id del usuario autenticado
        const adminId = req.usuario.identificacion;

        // Consultar las razas que pertenecen al administrador actual
        const [result] = await pool.query("SELECT * FROM razas WHERE admin_id = ?", [adminId]);

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                "Mensaje": "No hay razas registradas por este administrador"
            });
        }
    } catch (error) {
        res.status(500).json({
            "Mensaje": "Error en el sistema: " + error.message
        });
    }
};


//crud Registrar
export const RegistrarR = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        const { nombre_raza } = req.body;

        // Obtener la identificación del usuario que realiza el registro desde el token
        const adminId = req.usuario.identificacion;

        // Modifica la consulta SQL para incluir la identificación del administrador
        const [result] = await pool.query("INSERT INTO razas (nombre_raza, admin_id) VALUES (?, ?)", [nombre_raza, adminId]);

        if (result.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                message: 'Se registró la raza con éxito',
                result: result
            });
        } else {
            res.status(403).json({
                status: 403,
                message: 'No se registró la raza',
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message || 'Error en el sistema'
        });
    }
}


//actualizar
export const ActualizarR = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        const { id } = req.params;
        const { nombre_raza } = req.body;

        // Verificar si al menos uno de los campos está presente en la solicitud
        if (!nombre_raza) {
            return res.status(400).json({ message: 'Al menos uno de los campos (nombre_raza) debe estar presente en la solicitud para realizar la actualización.' });
        }

        // Obtener el admin_id del usuario autenticado
        const adminId = req.usuario.identificacion;

        // Verificar si la raza a actualizar pertenece al administrador actual
        const [oldRaza] = await pool.query("SELECT * FROM razas WHERE id_raza = ? AND admin_id = ?", [id, adminId]);
        if (oldRaza.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'No se encontró el registro para actualizar o no tiene permiso para actualizarlo.'
            });
        }

        // Realizar la actualización
        const [result] = await pool.query(
            `UPDATE razas SET nombre_raza = ? WHERE id_raza = ?`,
            [nombre_raza, id]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: 200,
                message: 'Se actualizó con éxito',
                result: result
            });
        } else {
            return res.status(404).json({
                status: 404,
                message: 'No se encontró el registro para actualizar'
            });
        }
    } catch (error) {
        console.error("Error en la función Actualizar:", error);
        return res.status(500).json({
            status: 500,
            message: error.message || "Error en el sistema"
        });
    }
};

export const BuscarR = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.usuario.identificacion;

        // Buscar la raza por ID y admin_id
        const [result] = await pool.query("SELECT * FROM razas WHERE id_raza = ? AND admin_id = ?", [id, adminId]);

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                status: 404,
                message: 'No se encontraron resultados para la búsqueda o no tiene permiso para acceder a esta raza'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error en el sistema: " + error.message
        });
    }
};

export const EliminarR = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.usuario.identificacion;

        // Verificar si la raza a eliminar pertenece al administrador actual
        const [oldRaza] = await pool.query("SELECT * FROM razas WHERE id_raza = ? AND admin_id = ?", [id, adminId]);
        if (oldRaza.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'No se encontró el registro para eliminar o no tiene permiso para eliminarlo.'
            });
        }

        // Iniciar una transacción
        await pool.query("START TRANSACTION");

        // Eliminar la raza
        await pool.query("DELETE FROM razas WHERE id_raza = ?", [id]);

        // Confirmar la transacción
        await pool.query("COMMIT");

        res.status(200).json({
            status: 200,
            message: 'Raza eliminada con éxito'
        });
    } catch (error) {
        // Si hay un error, deshacer la transacción
        await pool.query("ROLLBACK");
        res.status(500).json({
            status: 500,
            message: 'Error en el sistema: ' + error.message
        });
    }
};
