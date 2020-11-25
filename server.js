const express = require('express')
const bodyParser = require('body-Parser')
const app = express()
const ruta = require('path')
const listaCiudades = require('./JS/listaCiudadesArgentina.json')


//escucha en el puerto 5000

app.listen(5000)


//estos son meddlewares
//para que el param tenga un body.
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static('.'));

//aca se sirve la pagina
app.get('/', function (req, res) {
  res.sendFile(ruta.join(__dirname + '/index.html'))
})

//Obtener ciudades por id
app.get('/api/:id', (req,res)=>{
  const {params}= req
  const {id}=params
  var encontrado = false
  listaCiudades.forEach((ciudad)=>{
    if (ciudad.id == id) {
      encontrado=true
      res.status(200).send(ciudad)
    }
  })
  if(!encontrado){
    res.status(404).send('Not found');
  }
})


//endpoint para solicitar el pronostico en días de una ciudad.
//se estructura de la siguiente manera /pronostico?q={id_de_ciudad}&cantidad={numero_de_días}&desde={numero_de_dia}

//esta consulta requiere de un id de la ciudad a consulatar
//el numero de días a consultar ( hasta 7 dias)
//el numero del día del cual se comienza a recorrer

//ejemplo: la ciudad id= 1, cantidad = 2, desde=3
//devolverá el pronostico de neuquén, solo dos pronosticos a partir del tercer día.
//ejemplo2: la ciudad id= 1, cantidad = 2, desde=6
//devolverá un error, debido a que solo hay hasta 7 pronosticos por día a partir del día actual.
//ejemplo3: la ciudad id= 1, cantidad = 7, desde=0
//devolverá todos los pronosticos ( siete pronosticos) de neuquén
app.get('/api/pronostico/',(req,res)=>{
  const {query}= req


})

