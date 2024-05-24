import { pool } from "../database/conexion.js"
import { validationResult } from 'express-validator'
import upload from './carga.Img.js';

export const listarM = async (req, res) => {
    try {
        // Obtener el admin_id del usuario autenticado
        const adminId = req.usuario.identificacion;

        // Realizar la consulta para obtener los datos de las mascotas junto con información adicional
        const [result] = await pool.query(
            `SELECT 
                mascotas.id_mascota, 
                mascotas.name, 
                mascotas.foto,
                razas.nombre_raza as raza, 
                categorias.tipo_categoria as categoria, 
                generos.tipo_generos as genero 
            FROM mascotas
            JOIN razas ON mascotas.fk_id_raza = razas.id_raza
            JOIN categorias ON mascotas.fk_id_categoria = categorias.id_categoria
            JOIN generos ON mascotas.fk_id_genero = generos.id_genero
            WHERE mascotas.admin_id = ?`,
            [adminId]
        );

        // Verificar si se encontraron mascotas asociadas al administrador
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                mensaje: "No se encontraron mascotas asociadas al administrador",
            });
        }
    } catch (error) {
        res.status(500).json({
            mensaje: "Error interno del servidor",
            error: error.message // Puedes añadir más información sobre el error si lo necesitas
        });
    }
};

export const listarMdos = async (req, res) => {
    try {
        // Obtener el admin_id del usuario autenticado
        const adminId = req.usuario.identificacion;

        // Realizar la consulta para obtener los datos de las mascotas junto con información adicional
        const [result] = await pool.query(
            `SELECT 
            mascotas.id_mascota,
                mascotas.name, 
                mascotas.foto,
                razas.nombre_raza as raza
            FROM mascotas
            JOIN razas ON mascotas.fk_id_raza = razas.id_raza
            WHERE mascotas.admin_id = ?`,
            [adminId]
        );

        // Verificar si se encontraron mascotas asociadas al administrador
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                mensaje: "No se encontraron mascotas asociadas al administrador",
            });
        }
    } catch (error) {
        res.status(500).json({
            mensaje: "Error interno del servidor",
            error: error.message // Puedes añadir más información sobre el error si lo necesitas
        });
    }
};




export const RegistrarM = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        // Obtener la identificación del usuario que realiza el registro desde el token
        const adminId = req.usuario.identificacion;

        // Manejar la carga de archivos con Multer
        upload.single('foto')(req, res, async function (err) {
            if (err) {
                // Manejar errores de carga de archivos
                console.error('Error al cargar la imagen:', err);
                return res.status(500).json({ message: 'Error al cargar la imagen' });
            }

            // Extraer los valores del cuerpo de la solicitud
            const { name, fk_id_raza, fk_id_categoria, fk_id_genero } = req.body;

            // Validar que los campos no sean nulos o indefinidos
            if (!fk_id_raza || !fk_id_categoria || !fk_id_genero) {
                return res.status(400).json({ mensaje: "Los campos fk_id_raza, fk_id_categoria y fk_id_genero son obligatorios" });
            }

            // Obtener la ruta de la imagen cargada
            const foto = req.file ? req.file.filename : null; // Usar req.file.filename en lugar de req.file.path

            // Modificar la consulta SQL para incluir la identificación del administrador y la ruta de la imagen
            try {
                const [resultado] = await pool.query(
                    "INSERT INTO mascotas (name, fk_id_raza, fk_id_categoria, fk_id_genero, foto, admin_id) VALUES (?, ?, ?, ?, ?, ?)",
                    [name, fk_id_raza, fk_id_categoria, fk_id_genero, foto, adminId]
                );

                if (resultado.affectedRows > 0) {
                    return res.status(200).json({ mensaje: "Mascota registrada con éxito" });
                } else {
                    return res.status(400).json({ mensaje: "Hubo un error, no se pudo guardar la mascota" });
                }
            } catch (dbError) {
                console.error('Error al registrar la mascota en la base de datos:', dbError);
                return res.status(500).json({ mensaje: 'Error interno del servidor' });
            }
        });
    } catch (error) {
        console.error('Error al registrar la mascota:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

export const ActualizarM = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const adminId = req.usuario.identificacion;
        const { id_mascota } = req.params;

        // Manejar la carga de archivos con Multer
        upload.single('foto')(req, res, async function (err) {
            if (err) {
                console.error('Error al cargar la imagen:', err);
                return res.status(500).json({ message: 'Error al cargar la imagen' });
            }

            // Extraer los valores del cuerpo de la solicitud
            const { name, fk_id_raza, fk_id_categoria, fk_id_genero } = req.body;
            const foto = req.file ? req.file.filename : req.body.foto;

            // Verificar si al menos uno de los campos está presente en la solicitud
            if (!name && !fk_id_raza && !fk_id_categoria && !fk_id_genero && !foto) {
                return res.status(400).json({ message: 'Al menos uno de los campos (name, fk_id_raza, fk_id_categoria, fk_id_genero, foto) debe estar presente en la solicitud para realizar la actualización.' });
            }

            // Actualizar los datos en la base de datos
            const updateQuery = `UPDATE mascotas SET name=?, fk_id_raza=?, fk_id_categoria=?, fk_id_genero=?, foto=? WHERE id_mascota=?`;
            try {
                const [resultado] = await pool.query(updateQuery, [
                    name,
                    fk_id_raza,
                    fk_id_categoria,
                    fk_id_genero,
                    foto,
                    parseInt(id_mascota)
                ]);

                if (resultado.affectedRows > 0) {
                    // Consultar los datos actualizados de la mascota
                    let query = `SELECT 
                                        mascotas.id_mascota, 
                                        mascotas.name, 
                                        mascotas.foto,
                                        razas.nombre_raza as raza, 
                                        categorias.tipo_categoria as categoria, 
                                        generos.tipo_generos as genero 
                                    FROM mascotas
                                    JOIN razas ON mascotas.fk_id_raza = razas.id_raza
                                    JOIN categorias ON mascotas.fk_id_categoria = categorias.id_categoria
                                    JOIN generos ON mascotas.fk_id_genero = generos.id_genero
                                    WHERE mascotas.admin_id = ? AND mascotas.id_mascota = ?`;

                    const [result] = await pool.query(query, [adminId, parseInt(id_mascota)]);

                    if (result.length === 0) {
                        return res.status(404).json({ message: 'Mascota no encontrada' });
                    }

                    res.status(200).json({ mensaje: "Mascota actualizada con éxito", mascota: result[0] });
                } else {
                    res.status(400).json({ mensaje: "No se pudo actualizar la mascota" });
                }
            } catch (dbError) {
                console.error('Error al actualizar la mascota en la base de datos:', dbError);
                res.status(500).json({ mensaje: 'Error interno del servidor' });
            }
        });
    } catch (error) {
        console.error('Error al actualizar la mascota:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

/*   export const ActualizarM = async (req, res) => {
      try {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
          }
  
          const { id_mascota } = req.params;
  
          // Manejar la carga de archivos con Multer
          upload.single('foto')(req, res, async function (err) {
              if (err) {
                  console.error('Error al cargar la imagen:', err);
                  return res.status(500).json({ message: 'Error al cargar la imagen' });
              }
  
              // Extraer los valores del cuerpo de la solicitud
              const { name, fk_id_raza, fk_id_categoria, fk_id_genero } = req.body;
              const foto = req.file ? req.file.path : req.body.foto;
  
              // Verificar si al menos uno de los campos está presente en la solicitud
              if (!name && !fk_id_raza && !fk_id_categoria && !fk_id_genero && !foto) {
                  return res.status(400).json({ message: 'Al menos uno de los campos (name, fk_id_raza, fk_id_categoria, fk_id_genero, foto) debe estar presente en la solicitud para realizar la actualización.' });
              }
  
              // Obtener la información actual de la mascota
              const [oldUser] = await pool.query("SELECT * FROM mascotas WHERE id_mascota=?", [id_mascota]);
  
              if (oldUser.length === 0) {
                  return res.status(404).json({ message: 'Mascota no encontrada' });
              }
  
              // Preparar los valores para la actualización
              const updateValues = {
                  name: name ? name : oldUser[0].name,
                  fk_id_raza: fk_id_raza ? fk_id_raza : oldUser[0].fk_id_raza,
                  fk_id_categoria: fk_id_categoria ? fk_id_categoria : oldUser[0].fk_id_categoria,
                  fk_id_genero: fk_id_genero ? fk_id_genero : oldUser[0].fk_id_genero,
                  foto: foto ? foto : oldUser[0].foto,
              };
  
              // Actualizar los datos en la base de datos
              const updateQuery = `UPDATE mascotas SET name=?, fk_id_raza=?, fk_id_categoria=?, fk_id_genero=?, foto=? WHERE id_mascota=?`;
  
              try {
                  const [resultado] = await pool.query(updateQuery, [
                      updateValues.name,
                      updateValues.fk_id_raza,
                      updateValues.fk_id_categoria,
                      updateValues.fk_id_genero,
                      updateValues.foto,
                      parseInt(id_mascota)
                  ]);
  
                  if (resultado.affectedRows > 0) {
                      res.status(200).json({ mensaje: "Mascota actualizada con éxito" });
                  } else {
                      res.status(400).json({ mensaje: "No se pudo actualizar la mascota" });
                  }
              } catch (dbError) {
                  console.error('Error al actualizar la mascota en la base de datos:', dbError);
                  res.status(500).json({ mensaje: 'Error interno del servidor' });
              }
          });
      } catch (error) {
          console.error('Error al actualizar la mascota:', error);
          res.status(500).json({ mensaje: 'Error interno del servidor' });
      }
  }; */

/*     export const ActualizarM = async (req, res) => {
       try {
           const errors = validationResult(req);
           if (!errors.isEmpty()) {
               return res.status(400).json({ errors: errors.array() });
           }
   
           const { id_mascota } = req.params;
   
           // Obtener el valor de isUpdate del cuerpo de la solicitud
           const isUpdate = req.body.isUpdate === 'true';
   
           // Manejar la carga de archivos con Multer basado en el valor de isUpdate
           if (isUpdate) {
               upload.single('foto')(req, res, async function (err) {
                   if (err) {
                       console.error('Error al cargar la imagen:', err);
                       return res.status(500).json({ message: 'Error al cargar la imagen' });
                   }
   
                   // Resto del código para la actualización dentro de este bloque...
                   // Extraer los valores del cuerpo de la solicitud
                   const { fk_id_raza, fk_id_categoria, fk_id_genero } = req.body;
                   const foto = req.file ? req.file.path : req.body.foto;
   
                   // Verificar si al menos uno de los campos está presente en la solicitud
                   if (!fk_id_raza && !fk_id_categoria && !fk_id_genero && !foto) {
                       return res.status(400).json({ message: 'Al menos uno de los campos (fk_id_raza, fk_id_categoria, fk_id_genero, foto) debe estar presente en la solicitud para realizar la actualización.' });
                   }
   
                   // Obtener la información actual de la mascota
                   const [oldUser] = await pool.query("SELECT * FROM mascotas WHERE id_mascota=?", [id_mascota]);
   
                   if (oldUser.length === 0) {
                       return res.status(404).json({ message: 'Mascota no encontrada' });
                   }
   
                   // Preparar los valores para la actualización
                   const updateValues = {
                       fk_id_raza: fk_id_raza ? fk_id_raza : oldUser[0].fk_id_raza,
                       fk_id_categoria: fk_id_categoria ? fk_id_categoria : oldUser[0].fk_id_categoria,
                       fk_id_genero: fk_id_genero ? fk_id_genero : oldUser[0].fk_id_genero,
                       foto: foto ? foto : oldUser[0].foto,
                   };
   
                   // Actualizar los datos en la base de datos
                   const updateQuery = `UPDATE mascotas SET fk_id_raza=?, fk_id_categoria=?, fk_id_genero=?, foto=? WHERE id_mascota=?`;
   
                   try {
                       const [resultado] = await pool.query(updateQuery, [updateValues.fk_id_raza, updateValues.fk_id_categoria, updateValues.fk_id_genero, updateValues.foto, parseInt(id_mascota)]);
   
                       if (resultado.affectedRows > 0) {
                           res.status(200).json({ mensaje: "Mascota actualizada con éxito" });
                       } else {
                           res.status(400).json({ mensaje: "No se pudo actualizar la mascota" });
                       }
                   } catch (dbError) {
                       console.error('Error al actualizar la mascota en la base de datos:', dbError);
                       res.status(500).json({ mensaje: 'Error interno del servidor' });
                   }
               });
           } else {
               // Aquí manejas la actualización sin cargar una nueva imagen...
           }
       } catch (error) {
           console.error('Error al actualizar la mascota:', error);
           res.status(500).json({ mensaje: 'Error interno del servidor' });
       }
   }; */





export const BuscarM = async (req, res) => {
    try {
        const adminId = req.usuario.identificacion;
        const { id_mascota } = req.params;

        let query = `SELECT 
                            mascotas.id_mascota, 
                            mascotas.name, 
                            mascotas.foto,
                            razas.nombre_raza as raza, 
                            categorias.tipo_categoria as categoria, 
                            generos.tipo_generos as genero 
                        FROM mascotas
                        JOIN razas ON mascotas.fk_id_raza = razas.id_raza
                        JOIN categorias ON mascotas.fk_id_categoria = categorias.id_categoria
                        JOIN generos ON mascotas.fk_id_genero = generos.id_genero
                        WHERE mascotas.admin_id = ?`;

        if (id_mascota) {
            query += ` AND mascotas.id_mascota = ?`;
        }

        const params = [adminId];
        if (id_mascota) {
            params.push(id_mascota);
        }

        const [result] = await pool.query(query, params);

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                mensaje: "No se encontraron mascotas asociadas al administrador",
            });
        }
    } catch (error) {
        res.status(500).json({
            mensaje: "Error interno del servidor",
            error: error.message
        });
    }
};



export const EliminarM = async (req, res) => {
    try {
        const { id_mascota } = req.params;
        const [resultado] = await pool.query("delete from mascotas where id_mascota=?", [id_mascota])

        if (resultado.affectedRows > 0) {
            res.status(200).json({
                "mensaje": "desactivado con exito"
            })
        } else {
            res.status(404).json({
                "mensaje": "No se pudo desactivar"
            })
        }
    } catch (error) {
        res.status(500).json({
            "mensaje": error
        })
    }
}