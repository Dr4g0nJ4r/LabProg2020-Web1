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
      res.send(ciudad)
    }
  })
  if(!encontrado){
    res.status(404).send('Not found');
  }
})

app.get('/api/pronostico/',(req,res)=>{
  const {query}= req


})

