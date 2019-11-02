// Importamos el submódulo Router
const { Router } = require('express')

// Importamos modulo para validacion de IDs
const validator = require('validator')

// Importamos la base de datos y los modelos
const db = require('../database')
const Mascota = require('../database/models/mascotas.model')

// Instanciamos un router
const router = Router()
function parseParam(params) {
    if(params == "true"){
        return true
    }
    if(params == "false"){
        return false
    }
    return params
}
// Ruta para obtener todas las mascotas
router.get('/', function (req, res, next) {
    // Aca deben verifiar si hay query string
    // En caso de existir, filtrar segun los parametros
    let consultaMascota = {}
    const query = req.query

    if(query){
        for(param in query){
            consultaMascota[param]= parseParam(query[param])
        }
    }
    db.mascotas.find(consultaMascota, function (error, mascotas) {
            if (error) {
                return next(error)
            }
            mascotas.forEach(mascota => {
                let links = {'self': 'http://localhost:3000/mascotas/'+mascota._id,
                        'vacunas': 'http://localhost:3000/vacunas'}
                mascota.links = links
            });
            res.send(mascotas)
            
        })
})
router.options('/', function (req,res,next) {
    res.status(200)
    res.header('allow', 'GET, POST ,OPTIONS')
    res.send()
})
// Ruta para obtener los datos de una mascota en particular
router.get('/:idMascota', function (req, res, next) {
    const idMascota = req.params.idMascota;

    // Validamos el ID de la mascota buscada
    if (!validator.isUUID(idMascota)) {
        let error = new Error('El id especificado no tiene un formato correcto')
        return next(error)
    }

    db.mascotas
        .findOne({ _id: idMascota }, function (error, mascota) {
            if (error) {
                return next(error)
            }
            let links = {'self': 'http://localhost:3000/mascotas/'+idMascota,
                        'vacunas': 'http://localhost:3000/vacunas'}
            mascota.links = links
            res.send(mascota)
        })
})

// Ruta para crear una mascota
router.post('/', function (req, res, next) {
    const {nombre, tipo, esDeRaza, fechaNacimiento,raza} = req.body;

    // Opcionalmente, aqui puede validar los datos del body
    // Como por ejemplo, que la fecha de nacimiento tenga el formato correcto

    const mascota = new Mascota(nombre, tipo, fechaNacimiento,esDeRaza,raza)

    db.mascotas
        .insert(mascota, function (error, mascotaInsertada) {
            if (error) {
                return next(error)
            }
            res.header('Location', '/mascotas/'+mascotaInsertada._id)
            res.status(201)
            res.send(mascotaInsertada)            
        })
})
// Ruta para obtener los datos de una mascota en particular
router.patch('/:idMascota', function (req, res, next) {
    const idMascota = req.params.idMascota;
    const data = req.body
    // Validamos el ID de la mascota buscada
    if (!validator.isUUID(idMascota)) {
        let error = new Error('El id especificado no tiene un formato correcto')
        return next(error)
    }

    db.mascotas
        .findOne({ _id: idMascota }, function (error, mascota) {
            if (error) {
                return next(error)
            }
            
            patchEntity(mascota,data)
            db.mascotas
            .update({ _id: idMascota }, mascota, function (error, numReplaced) {
                if (error) {
                    return next(error)
                }
                switch (numReplaced) {
                    case 0:
                        res.send({
                            "mensaje": "La mascota no se actualizo"
                        })
                        break;
                    case 1:
                        res.send(mascota)
                        break;
                
                    default:
                        break;
                }
              });
        })
})
router.delete('/:idMascota', function (req,res,next) {
    const idMascota = req.params.idMascota;
    if (!validator.isUUID(idMascota)) {
        let error = new Error('El id especificado no tiene un formato correcto')
        return next(error)
    }
    db.mascotas
    .remove({ _idMascota: idMascota }, {}, function (err, numRemoved) {
        if(err){
            return next(err)
        }
        switch (numRemoved) {
            case 0:
                res.send({
                    "mensaje": "La mascota no se elimino"
                })
                break;
            case 1:
                res.send({
                    "mensaje": "La mascota se eliminó con éxito"
                })
                break;
        
            default:
                break;
        }
      });
})
function patchEntity(model, data){
    for(atributo in model){
        if(data.hasOwnProperty(atributo)){
            model[atributo]=data[atributo]
        }
    }
    return model
}
// Definir el resto de las rutas necesarias aqui debajo
// ...

// Exportamos nuestro router
module.exports = router;