const express = require("express");
const bodyParser = require("body-Parser");
const app = express();
const ruta = require("path");
const fs = require("fs");
//const { response } = require("express");
const router = require("./router");
//const validate = require("express-jsonschema").validate;

//escucha en el puerto 5000
app.listen(5000);

//estos son middlewares
//para que el param tenga un body.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("."));

app.use("/api", router);

//aca se sirve la pagina
app.get("/", function (req, res) {
  res.sendFile(ruta.join(__dirname + "/index.html"));
});

function guardarDatos(listaCiudades) {
  let lista = JSON.stringify(listaCiudades, null, 2);
  fs.writeFile("./JS/listaCiudadesArgentina.json", lista, function (err, data) {
    if (err) {
      return console.log(err);
    }
    console.log(`${data} > listaCiudadesArgentina.json`);
  });
}
