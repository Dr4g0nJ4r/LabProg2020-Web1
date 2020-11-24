const express = require('express')
const bodyParser = require('body-Parser')
const app = express()
const ruta = require('path')

//imports de metodos de cities
import { getCiudad } from "cities";
//escucha en el puerto 5000

app.listen(5000)


//estos son meddlewares
//para que el param tenga un body.
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static('.'));

//aca se sirve la pagina
app.get('/', function (req, res) {
    //obtener datos
    
  res.sendFile(ruta.join(__dirname + '/index.html'))
})


app.get('/api/:id', (req,res)=>{
})

