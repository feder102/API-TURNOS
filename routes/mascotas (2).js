// Importamos el submódulo Router
const { Router } = require('express')

// Importamos modulo para validacion de IDs
const validator = require('validator')

// Importamos la base de datos y los modelos
const db = require('../database')
const Mascota = require('../database/models/mascotas.model')


// Instanciamos un router
const router = Router()

// Ruta para obtener todas las mascotas
router.get('/', function (req, res, next) {
    let query = {}
    if(req.query.hasOwnProperty('esDeRaza'))
       query.esDeRaza = req.query.esDeRaza == 'true'
    if(req.query.hasOwnProperty('tipo'))
       query.tipo = req.query.tipo
    if(req.query.hasOwnProperty('raza'))
       query.raza = req.query.raza


    db.mascotas.find(query, function (error, mascotas) {
            if (error) {
                next(error)
            }
            res.send(mascotas)
        })
})


// Ruta para obtener los datos de una mascota en particular
router.get('/:idMascota', function (req, res, next) {
    const idMascota = req.params.idMascota;

    // Validamos el ID de la mascota buscada
    if (!validator.isUUID(idMascota)) {
        let error = new Error('El id especificado no tiene un formato correcto')
        next(error)
    }

    db.mascotas
        .findOne({ _id: idMascota }, function (error, mascota) {
            if (error) {
                next(error)
            }
            res.send(mascota)
        })
})

router.get('/:idMascota/vacunas', function (req, res, next) {
    const idMascota = req.params.idMascota;

    // Validamos el ID de la mascota buscada
    if (!validator.isUUID(idMascota)) {
        let error = new Error('El id especificado no tiene un formato correcto')
        next(error)
    }

    db.vacunas
        .findOne({ _id: idMascota }, function (error, mascota) {
            if (error) {
                next(error)
            }
            res.send(mascota)
        })
})


// Ruta para eliminar los datos de una mascota en particular
router.delete('/:idMascota', function (req, res, next) {
    const idMascota = req.params.idMascota;

    // Validamos el ID de la mascota buscada
    if (!validator.isUUID(idMascota)) {
        let error = new Error('El id especificado no tiene un formato correcto')
        next(error)
    }
    db.mascotas
        .findOne({ _id: idMascota }, function (error, mascotaExistente) {
            if (error)
                return next(error)
            db.mascotas
                .remove({ _id: idMascota }, {}, function (error, numRemoved) {
                    if (error)
                        return next(error)
                    if(numRemoved == 1)
                        res.send(mascotaExistente)
                    else
                        return next(error)
                })
    })
})

// Ruta para crear una mascota
router.post('/', function (req, res, next) {
    const data = req.body;

    // Opcionalmente, aqui puede validar los datos del body
    // Como por ejemplo, que la fecha de nacimiento tenga el formato correcto
    let mascotaNueva
    if(data.esDeRaza)
        mascotaNueva = new Mascota(data.nombre, data.tipo, data.fechaNacimiento, true, data.raza)
    else 
        mascotaNueva = new Mascota(data.nombre, data.tipo, data.fechaNacimiento, false, null)
    db.mascotas
        .insert(mascotaNueva, function (error, mascotaInsertada) {
            if (error)
                next(error)

            res.send(mascotaInsertada)
        })
})

// Ruta para modificar una mascota
router.patch('/:idMascota', function (req, res, next) {
    const data = req.body;
    const idMascota = req.params.idMascota;
    if (!validator.isUUID(idMascota)) {
        let error = new Error('El id especificado no tiene un formato correcto')
        next(error)
    }
    db.mascotas
        .findOne({ _id: idMascota }, function (error, mascotaExistente) {
            if (error) 
                return next(error)
            for (var prop in data)
            {
                if(prop == '_id' || prop == 'id')
                    continue
                if (data.hasOwnProperty.call(mascotaExistente, prop))
                    mascotaExistente[prop] = data[prop]
                else
                    return next(error)
            }
            db.mascotas
                .update({ _id: idMascota }, mascotaExistente, {}, (error, numAffected, mascotaActualizada) => {
                    if (error)
                        return next(error)
                    if(numAffected == 1)
                        res.send(mascotaExistente)
                    else
                        return next(error)
                })
        })
})

// Exportamos nuestro router
module.exports = router;