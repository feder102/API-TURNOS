// Importamos express
const express = require('express')

// Importamos los middleware necesarios
const morgan = require('morgan')
const bodyParser = require('body-parser')

// Importamos los routers
const mascotasRouter = require('./routes/mascotas.js')

// Instanciamos una app de Express
const app = express()

// Utilizamos los middleware
app.use(morgan('dev'))
app.use(bodyParser.json())

app.get('/', (req, res, next) => {
    res.send({
        nombre: 'API Veterinaria',
        version: '1.0.0',
        links: [{
                rel: 'mascotas',
                href:'/mascotas'
            },
            {
                rel:'vacunas',
                href:'/vacunas'
            }]
    })
})
function checkQuery(req,res,next) {
    if(Object.keys(req.query).length == 0){
        req.query = null
    }
    next()
}

app.use(checkQuery)
// Le indicamos a nuestra app que use los routers
app.use('/mascotas', mascotasRouter)

// Establecemos el middleware para manejo de error 404
app.use((req, res, next) => {
    res.status(404)
        .send({
            error: 'Recurso no encontrado',
        })
})

// Establecemos el middleware para manejo de error 500
app.use((err, req, res, next) => {
    res.status(500)
        .send({
            error: err.message,
        })
})

// Exportamos nuestra app
module.exports = app
