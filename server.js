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


app.get('/api/:id', (req,res)=>{
  const {params}= req
  const {id}=params

  listaCiudades.forEach((ciudad)=>{
    if (ciudad.id == id) {
      res.status(200)
      res.send(ciudad)
    }else{
      res.status(404)
      res.send("no se encontró la ciudad")
    }
  })
  
  
})

