import express  from 'express' 
import  body_parser from 'body-parser'
import rutaValidacion from './src/routes/autenticacion.js'
import rutaUsuario from './src/routes/Usuarios.route.js'
import rutaMascotas from './src/routes/Mascotas.routes.js'
import routerGeneros from './src/routes/Generos.routes.js'
import routerCategorias from './src/routes/Categorias.routes.js'
import routerRazas from './src/routes/Razas.routes.js'

import cors from 'cors'
import fileupload from 'express-fileupload'


//servidor
const servidor = express()

servidor.use(cors())
servidor.use(body_parser.json())
servidor.use(body_parser.urlencoded({extended: false}))
servidor.listen(3000, () =>{
    console.log("esta funcionando")
})

//rutas
servidor.use(rutaValidacion)
servidor.use('/usuarios',rutaUsuario)
servidor.use(rutaMascotas)
servidor.use(routerGeneros)
servidor.use(routerRazas)
servidor.use(routerCategorias)

// imagenes
servidor.use(fileupload({
    createParentPath:true
}))
servidor.post("/RegistrarMascota", async (req, res) => {
    try {
        if (!req.files){
            res.status(400).json({message:"no se pudo"})
        }else{
            let file = req.files.foto
            file.mv("./uploads"+file.name)
            res.status(200).json({message:"ok",
                data:{
                    name:file.name,
                    size:file.size,
                    type:file,mimetype
                }
            })
        }
    } catch (error) {
        res.status(500).json({error})
    }
})
//carpetas documentacion
servidor.set('view engine', 'ejs');
servidor.set('views','./views');
servidor.get('/documents',(req,res)=>{
    res.render('document.ejs');
})
servidor.use(express.static('./public'));


