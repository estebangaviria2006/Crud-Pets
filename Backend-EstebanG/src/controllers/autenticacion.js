/* import { pool } from "../database/conexion.js";
import  Jwt  from "jsonwebtoken";
 */
/* 
export const validar = async (req, res) => {
    try {
        let { email, password } = req.body;
        let sql = `SELECT * from usuarios where email='${email}' and password='${password}'`;

        const [rows] = await pool.query(sql);
        if (rows.length > 0) {
            // Incluir la identificación y el rol del usuario en el token JWT
            let token = Jwt.sign({ 
                identificacion: rows[0].identificacion
            }, process.env.AUT_SECRET, { expiresIn: process.env.AUT_EXPIRE });
            return res.status(200).json({ 'user': rows, 'token': token, message: 'Token generado con éxito' });
        } else {
            return res.status(404).json({ "message": "Usuario no autorizado" });
        }

    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error del servidor' + error });
    }

}

export const validarToken = async (req, res, next) => {
    try {
        let tokenClient = req.headers['token'];

        if (!tokenClient) {
            return res.status(403).json({ message: 'Token es requerido' });
        } else {
            Jwt.verify(tokenClient, process.env.AUT_SECRET, (error, decoded) => {
                if (error) {
                    return res.status(403).json({ message: 'Token es inválido o ha expirado' });
                } else {
                    // Decodificar el token y establecer req.usuario
                    req.usuario = decoded;
                    next();
                }
            });
        }
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error del servidor: ' + error.message });
    }
};

 */




//// ESte esta funcionado para listar 

import { pool } from "../database/conexion.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const validar = async (req, res) => {
    try {
        let { email, password } = req.body;
        const sql = `SELECT * FROM usuarios WHERE email = ?`;
        const [rows] = await pool.query(sql, [email]);
      
        if (rows.length === 0) {
            return res.status(401).json({ message: "Usuario no registrado" });
        }
      
        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
      
        if (!validPassword) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }
      
        const token = Jwt.sign({ 
            identificacion: user.identificacion
        }, process.env.AUT_SECRET, {
            expiresIn: process.env.AUT_EXPIRE,
        });
      
        res.status(200).json({ user, token, message: 'Token generado con éxito' });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error del servidor' + error });
    }
};

export const validarToken = async (req, res, next) => {
    try {
        let tokenClient = req.headers['token'];
      
        if (!tokenClient) {
            return res.status(403).json({ message: 'Token es requerido' });
        } else {
            Jwt.verify(tokenClient, process.env.AUT_SECRET, (error, decoded) => {
                if (error) {
                    return res.status(403).json({ message: 'Token es inválido o ha expirado' });
                } else {
                    req.usuario = decoded;
                    next();
                }
            });
        }
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error del servidor' + error.message });
    }
};
