import { pool } from "../database/conexion.js";
import { validationResult } from 'express-validator';
export const listarC = async (req, res) => {
    try {
        // Obtener la identificación del administrador desde el token
        const adminId = req.usuario.identificacion;

        if (!adminId) {
            return res.status(403).json({ message: 'No se proporcionó la identificación del administrador en el token' });
        }

        const [result] = await pool.query("SELECT * FROM categorias WHERE admin_id = ?", [adminId]);

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(400).json({
                "Mensaje": "No hay categorias"
            });
        }
    } catch (error) {
        res.status(500).json({
            "Mensaje": "Error en el sistema"
        });
    }
};


//crud Registrar
export const RegistroC = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        const { tipo_categoria } = req.body;

        // Obtener la identificación del usuario que realiza el registro desde el token
        const adminId = req.usuario.identificacion;

        // Modificar la consulta SQL para incluir la identificación del administrador
        const [result] = await pool.query("INSERT INTO categorias (tipo_categoria, admin_id) VALUES (?, ?)", [tipo_categoria, adminId]);

        if (result.affectedRows > 0) {
            res.status(200).json({
                status: 200,
                message: 'Se registró la categoría con éxito',
                result: result
            });
        } else {
            res.status(403).json({
                status: 403,
                message: 'No se registró la categoría',
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message || 'Error en el sistema'
        });
    }
};


//actualizar
export const ActualizarC = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        const { id } = req.params;
        const { tipo_categoria } = req.body;

        // Obtener la identificación del administrador desde el token
        const adminId = req.usuario.identificacion;

        // Verifica si al menos uno de los campos está presente en la solicitud
        if (!tipo_categoria) {
            return res.status(400).json({ message: 'Al menos uno de los campos (tipo_categoria) debe estar presente en la solicitud para realizar la actualización.' });
        }

        console.log("Consulta SQL:", `SELECT * FROM categorias WHERE id_categoria=${id}`);

        const [oldRecord] = await pool.query("SELECT * FROM categorias WHERE id_categoria=?", [id]);

        const [result] = await pool.query(
            `UPDATE categorias SET tipo_categoria=?, admin_id=? WHERE id_categoria=?`,
            [tipo_categoria || oldRecord[0].tipo_categoria, adminId, id]
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
export const BuscarC = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.usuario.identificacion;

        const [result] = await pool.query("SELECT * FROM categorias WHERE id_categoria = ? AND admin_id = ?", [id, adminId]);

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

export const eliminarC = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.usuario.identificacion;

        // Inicia una transacción
        await pool.query("START TRANSACTION");

        // Elimina los registros de la tabla mascotas relacionados con el id_categoria a eliminar
        await pool.query("DELETE FROM mascotas WHERE fk_id_categoria = ? AND admin_id = ?", [id, adminId]);

        // Elimina el registro de la tabla categorias
        await pool.query("DELETE FROM categorias WHERE id_categoria = ? AND admin_id = ?", [id, adminId]);

        // Confirma la transacción
        await pool.query("COMMIT");

        res.status(200).json({
            status: 200,
            message: `Registros relacionados en la tabla categorias y mascotas eliminados correctamente`,
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
