// Importamos el submódulo Router
const { Router } = require('express')

// Importamos modulo para validacion de IDs
const validator = require('validator')

// Importamos la base de datos y los modelos
const db = require('../database')
const Vacunas = require('../database/models/vacunas.model')


// Instanciamos un router
const router = Router()

// Ruta para obtener todas las vacunas
router.get('/', function (req, res, next) {
    let query = {}
    if(req.query.hasOwnProperty('tipo'))
       query.tipo = req.query.tipo
    // if(req.query.hasOwnProperty('tipo'))
    //    query.tipo = req.query.tipo
    // if(req.query.hasOwnProperty('raza'))
    //    query.raza = req.query.raza


    db.vacunas.find(query, function (error, vacunas) {
            if (error)
                next(error)
            res.send(vacunas)
        })
})

router.post('/', function (req, res, next) {
    const data = req.body;

    if (!validator.isUUID(data.idMascota)) {
        let error = new Error('El id especificado no tiene un formato correcto')
        return next(error)
    }
    const vacunaNueva = new Vacunas(data.tipo, data.fechaRealizacion, data.idMascota)
    
    db.vacunas
        .insert(vacunaNueva, function (error, vacunaInsertada) {
            if (error)
                return next(error)
            res.send(vacunaInsertada)
        })
})



// Exportamos nuestro router
module.exports = router;