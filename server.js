const express = require('express')
const bodyParser = require('body-Parser')
const app = express()
const ruta = require('path')


//escucha en el puerto 5000

app.listen(5000)


//estos son meddlewares
//para que el param tenga un body, del cual sacar datos para la creación de gatitos
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static('.'));

//aca se sirve la pagina
app.get('/', function (req, res) {
    //obtener datos
    
  res.sendFile(ruta.join(__dirname + '/index.html'))
})
