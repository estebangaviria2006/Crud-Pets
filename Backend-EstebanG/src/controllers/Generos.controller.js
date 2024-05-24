import { pool } from "../database/conexion.js";
import { validationResult } from 'express-validator';

//crud listar
export const listarG = async (req, res) => {
    try {
        // Obtener la identificación del administrador desde el token
        const adminId = req.usuario.identificacion;

        if (!adminId) {
            return res.status(403).json({ message: 'No se proporcionó la identificación del administrador en el token' });
        }

        // Consultar los géneros asociados al administrador actual
        const [result] = await pool.query("SELECT * FROM generos WHERE admin_id = ?", [adminId]);

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(400).json({ message: "No hay géneros registrados para este administrador" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error en el sistema: " + error.message });
    }
};

//crud Registrar
export const RegistroG = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors });
        }

        const { tipo_generos } = req.body;

        // Obtener la identificación del usuario que realiza el registro desde el token
        const adminId = req.usuario.identificacion;

        // Modificar la consulta SQL para incluir la identificación del administrador
        const [result] = await pool.query("INSERT INTO generos (tipo_generos, admin_id) VALUES (?, ?)", [tipo_generos, adminId]);

        if (result.affectedRows > 0) {
            return res.status(200).json({
                status: 200,
                message: 'Se registró el género con éxito',
                result: result
            });
        } else {
            return res.status(403).json({
                status: 403,
                message: 'No se registró el género',
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message || 'Error en el sistema'
        });
    }
};

//actualizar

export const ActualizarG = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        const { id } = req.params;
        const { tipo_generos } = req.body;

        // Obtener la identificación del administrador desde el token
        const admin_id = req.usuario.identificacion;

        // Verifica si al menos uno de los campos está presente en la solicitud
        if (!tipo_generos) {
            return res.status(400).json({ message: 'Al menos uno de los campos (tipo_generos ) debe estar presente en la solicitud para realizar la actualización.' });
        }

        console.log("Consulta SQL:", `SELECT * FROM generos WHERE id_genero=${id}`);

        const [oldGenero] = await pool.query("SELECT * FROM generos WHERE id_genero=?", [id]);

        const [result] = await pool.query(
            `UPDATE generos SET tipo_generos=?, admin_id=? WHERE id_genero=?`,
            [tipo_generos || oldGenero[0].tipo_generos, admin_id, id]
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
        console.error("Error en la función ActualizarG:", error);
        return res.status(500).json({
            status: 500,
            message: error.message || "Error en el sistema"
        });
    }
};

export const BuscarG = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query("SELECT * FROM generos WHERE id_genero = ? AND admin_id = ?", [id, req.usuario.identificacion]);

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                status: 404,
                message: 'No se encontraron resultados para la búsqueda'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Error en el sistema"
        });
    }
};

export const eliminarG = async (req, res) => {
    try {
        const { id } = req.params;

        // Inicia una transacción
        await pool.query("START TRANSACTION");

        // Elimina los registros de la tabla mascotas relacionados con el id_generos a eliminar
        await pool.query("DELETE FROM mascotas WHERE fk_id_genero = ? AND admin_id = ?", [id, req.usuario.identificacion]);

        // Elimina el registro de la tabla generos
        await pool.query("DELETE FROM generos WHERE id_genero = ? AND admin_id = ?", [id, req.usuario.identificacion]);

        // Confirma la transacción
        await pool.query("COMMIT");

        res.status(200).json({
            status: 200,
            message: `Registros relacionados en la tabla generos y mascotas eliminados correctamente`,
        });
    } catch (error) {
        // Si ocurre un error, deshace la transacción
        await pool.query("ROLLBACK");
        res.status(500).json({
            status: 500,
            message: error.message || 'Error en el sistema',
        });
    }
};
