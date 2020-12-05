//RUTEADOR
//para ser usado por el server.
const express = require("express");
const router = express.Router();
const lista = require("./controller");
const validador = require("./JS/validador");
const validate = require("express-jsonschema").validate;

//Rutas que llevan a los distintos endpoints de la API

/*
  Endpoint get que permite consultar varias ciudades.
  Estructura: api/ciudad?cantidad={cantidad de ciudades a retornar}&desde={desde que ciudad se retorna}

*/
router.get("/ciudades", lista.getCiudadesPorRango);
//Obtener ciudades por id
router.get("/:id", lista.getCiudadesPorId);
//Publica una nueva ciudad POST. Se valida con el jsonSchema para verificar campos y valores
router.post(
  "/api/ciudad",
  validate({ body: validador.jsonSchemaCrearCiudad }),
  lista.postCiudad
);
//Publica un endpoint para actualizar datos de la ciudad. Se valida con el jsonSchema para verificar campos y valores
router.put(
  "/ciudad/:id",
  validate({ body: validador.jsonSchemaActualizarCiudad }),
  lista.actualizarCiudad
);
//endpoint para solicitar el pronostico en días de una ciudad.
//se estructura de la siguiente manera /pronostico?id={id_ciudad_a_consultar}&cantidad={número_de_días}&desde={número_de_día}

//esta consulta requiere del ID de la ciudad a consultar
//el número de días a consultar ( hasta 7 dias)
//el número del día del cual se comienza a recorrer

//ejemplo: la ciudad id=1, cantidad = 2, desde=3
//devolverá el pronostico de neuquén, solo dos pronosticos a partir del tercer día.

//ejemplo de consula para neuquen: http://localhost:5000/api/consulta/q?id=1&cantidad=3&desde=0
router.get(
  "/consulta/q",
  validate({ query: validador.querySchemaConsulta }),
  lista.consultaPronosticos
);

///////////////ENDPOINTS PARA USO INTERNO///////////////////

//Endpoint para obtener los datos actuales dependiendo de la ciudad

router.get("/actual/:ciudad", lista.getDatosClimaActual);

router.get("/pronostico/:latitud&:longitud", lista.getPronosticos);

router.get("/historico/:latitud&:longitud&:tiempo", lista.getHistoricos);

//En caso de surgir un error con el esquema del Json, se ejecuta la siguiente función que retorna información sobre el error
router.use((err, req, res, next) => {
  var responseData;
  if ((err.name = "JsonSchemaValidation")) {
    console.log(err.message);
    console.log(err.validations);
    res.status(400);
    responseData = {
      statusText: "Bad Request",
      jsonSchemaValidation: true,
      validations: err.validations,
      message: err.message,
    };
    if (req.xhr || req.get("Content-Type") === "application/json") {
      res.json(responseData);
    } else {
      //res.render('badRequestTemplate', responseData);
      res.json(responseData);
    }
  } else {
    next(err);
  }
});

module.exports = router;
