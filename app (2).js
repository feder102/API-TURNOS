// Importamos express
const express = require('express')

// Importamos los middleware necesarios
const morgan = require('morgan')
const bodyParser = require('body-parser')

// Importamos los routers
const mascotasRouter = require('./routes/mascotas.js')
const vacunasRouter = require('./routes/vacunas.js')

// Instanciamos una app de Express
const app = express()

// Importamos la documentacion de la API
const swaggerUi= require('swagger-ui-express')
const apiDocs = require('./docs/index.js')  

// Utilizamos los middleware
app.use(morgan('dev'))
app.use(bodyParser.json())
// app.use('/headers',require('./routes/headers'));
app.get('/', (req,res,next) => {

    res.send({
       nombre: 'API Veterinaria',
       version: '1.0.0',
       links: [{
   
               rel:'mascotas',
               href: '/mascotas'
           },
           {
               rel: 'vacunas',
               href: '/vacunas'
           }
       ]
       })
   })

   // Montamos la documentacion en la ruta /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiDocs));
app.options('/',(req,res,next) =>{

    
    res.header('allow', 'GET')
    .status(204)
    .send()
})
// Le indicamos a nuestra app que use los routers
app.use('/mascotas', mascotasRouter)
app.use('/vacunas', vacunasRouter)

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
