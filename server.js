const express = require("express");
const bodyParser = require("body-Parser");
const app = express();
const ruta = require("path");
const listaCiudades = require("./JS/listaCiudadesArgentina.json");
const fetch = require("node-fetch");
const fs = require("fs");
const { response } = require("express");
const validate = require("express-jsonschema").validate;
const verificador = require("./JS/verificador");

//JSON schema para verificar y comprobar los campos y valores de los json que se reciben para los endpoint POST y PUT
/*
Ejemplo de json recibido con los campos y valores de forma correcta
{
        "id": 1,
        "name": "Neuquén",
        "state": "",
        "country": "AR",
        "coord": {
            "lon": -68.059097,
            "lat": -38.951611
        }
    }
*/
var jsonSchemaCrearCiudad = {
  type: "object",
  properties: {
    id: {
      type: "number",
      required: true,
    },
    name: {
      type: "string",
      required: true,
    },
    state: {
      type: "string",
      required: true,
    },
    country: {
      type: "string",
      required: true,
    },
    coord: {
      type: "object",
      properties: {
        lon: { type: "number", required: true },
        lat: { type: "number", required: true },
      },
    },
  },
};

/*
Esquema json para actualizar ciudad
*/
var jsonSchemaActualizarCiudad = {
  type: "object",
  properties: {
    name: {
      type: "string",
      required: true,
    },
    state: {
      type: "string",
      required: true,
    },
    country: {
      type: "string",
      required: true,
    },
    coord: {
      type: "object",
      properties: {
        lon: { type: "number", required: true },
        lat: { type: "number", required: true },
      },
    },
  },
  additionalProperties: false,
};
/*
    Esquema de la consulta GET Pronóstico
    */
var querySchemaConsulta = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "numeric",
      required: true,
    },
    cantidad: {
      type: "string",
      format: "numeric",
      required: true,
    },
    desde: {
      type: "string",
      format: "numeric",
      required: true,
    },
  },
};
//escucha en el puerto 5000
app.listen(5000);

//estos son middlewares
//para que el param tenga un body.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("."));

//aca se sirve la pagina
app.get("/", function (req, res) {
  res.sendFile(ruta.join(__dirname + "/index.html"));
});

/*
  Endpoint get que permite consultar varias ciudades.
  Estructura: api/ciudad?cantidad={cantidad de ciudades a retornar}&desde={desde que ciudad se retorna}

*/
app.get("/api/ciudades", (req, res) => {
  const { query } = req;
  var cantidad = Number(query.cantidad);
  var desde = Number(query.desde);
  var arrayCiudades = [];
  if (desde >= listaCiudades.length) {
    res
      .status(400)
      .send(
        `Se excede el límite desde el que se quiere consultar. La lista solo cuenta con ${listaCiudades.length} ciudades`
      );
  } else {
    if (cantidad <= 0) {
      res
        .status(406)
        .send(
          `Se ingresó un valor inválido de cantidad. Debe ingresar un número entero positivo.`
        );
    } else {
      for (
        var index = desde;
        index < cantidad + desde && index < listaCiudades.length;
        index++
      ) {
        var element = listaCiudades[index];
        if (element != null) {
          arrayCiudades.push(element);
        }
        console.log(index);
      }
      res.status(200).send(JSON.stringify(arrayCiudades));
    }
  }
});
//Obtener ciudades por id
app.get("/api/:id", (req, res) => {
  const { params } = req;
  const { id } = params;
  var encontrado = false;

  listaCiudades.forEach((ciudad) => {
    if (ciudad.id == id) {
      encontrado = true;
      res.status(200).send(ciudad);
    }
  });
  if (!encontrado) {
    res.status(404).send("No se ha encontrado la ciudad!");
  }
});

//Publica una nueva ciudad POST. Se valida con el jsonSchema para verificar campos y valores
app.post(
  "/api/ciudad",
  validate({ body: jsonSchemaCrearCiudad }),
  (req, res) => {
    const { body } = req;
    let existe = false;
    listaCiudades.forEach((ciudad) => {
      if (ciudad.id == body.id) {
        existe = true;
        res.status(200).send(`Ya existe una ciudad con el id: ${body.id}`);
      }
    });
    //no existe la ciudad, se crea una nueva
    if (!existe) {
      const nuevaCiudad = {
        id: body.id,
        name: body.name,
        state: body.state,
        country: body.country,
        coord: body.coord,
      };
      listaCiudades.push(nuevaCiudad);
      guardarDatos(listaCiudades);
      ciudadNueva = listaCiudades.find((ciudad) => ciudad.id === body.id);
      res.status(200).send(`Se creó una nueva ciudad ${ciudadNueva}`);
      console.log(listaCiudades);
    }
  }
);

//Publica un endpoint para actualizar datos de la ciudad. Se valida con el jsonSchema para verificar campos y valores
app.put(
  "/api/ciudad/:id",
  validate({ body: jsonSchemaActualizarCiudad }),
  (req, res) => {
    const { params } = req;
    const { id } = params;
    const { body } = req;
    let existe = false;
    ciudad = listaCiudades.find((data) => data.id == id);
    if (ciudad == undefined) {
      res.status(200).send(`No existe una ciudad con el id ${id}`);
    } else {
      listaCiudades.forEach((ciudad) => {
        if (ciudad.id == id) {
          ciudad.id = Number(id);
          ciudad.name = body.name;
          ciudad.state = body.state;
          ciudad.country = body.country;
          ciudad.coord = body.coord;
        }
      });
      guardarDatos(listaCiudades);
      res.status(200).send(`Se actualizó la ciudad con el id ${id}`);
    }
  }
);
//endpoint para solicitar el pronostico en días de una ciudad.
//se estructura de la siguiente manera /pronostico?id={id_ciudad_a_consultar}&cantidad={número_de_días}&desde={número_de_día}

//esta consulta requiere del ID de la ciudad a consultar
//el número de días a consultar ( hasta 7 dias)
//el número del día del cual se comienza a recorrer

//ejemplo: la ciudad id=1, cantidad = 2, desde=3
//devolverá el pronostico de neuquén, solo dos pronosticos a partir del tercer día.

//ejemplo de consula para neuquen: http://localhost:5000/api/consulta/q?id=1&cantidad=3&desde=1
app.get(
  "/api/consulta/q",
  validate({ query: querySchemaConsulta }),
  (req, res) => {
    const { query } = req;
    var id = query.id;
    var ciudad = listaCiudades.find((ciudad) => ciudad.id === Number(id));
    console.log(ciudad);
    if (ciudad != undefined) {
      var latitud = ciudad.coord.lat;
      var longitud = ciudad.coord.lon;
      console.log(latitud);
      console.log(longitud);
    }
    var cantidad = query.cantidad;
    var desde = query.desde;
    var pronosticos = [];

    if (cantidad <= 7 && cantidad > 1 && desde >= 1 && desde < 7) {
      // se establece un limite a la cantidad de días a consultar, que depende del día desde que se empieza a contar
      var limiteCantidad = 7 - desde;
      if (cantidad <= limiteCantidad) {
        fetch(
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
            latitud +
            "&lon=" +
            longitud +
            "&lang=es&exclude=current,minutely,hourly,alerts&units=metric&appid=073b5617fc4dbf48ce277078f57f3caf"
        ) // pronostico
          .then((Response) => Response.json())
          .then((data) => {
            for (let i = desde; i <= cantidad; i++) {
              pronosticos.push(data.daily[i]);
            }
            res.send(pronosticos);
          })
          .catch();
      } else {
        res.status(400).send("la cantidad supera el limite de días");
      }
    } else {
      res.status(400).send("la cantidad o el valor 'desde' son incorrectos");
    }
  }
);
//En caso de surgir un error con el esquema del Json, se ejecuta la siguiente función que retorna información sobre el error
app.use(function (err, req, res, next) {
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

///////////////ENDPOINTS PARA USO INTERNO///////////////////

//Endpoint para obtener los datos actuales dependiendo de la ciudad
app.get("/api/actual/:ciudad", (req, res) => {
  const { params } = req;
  const { ciudad } = params;
  console.log(ciudad);

  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      ciudad +
      "&units=metric&lang=es&appid=073b5617fc4dbf48ce277078f57f3caf"
  )
    .then((Response) => Response.json())
    .then((data) => {
      console.log(data);
      res.send(data);
    });
});

app.get("/api/pronostico/:latitud&:longitud", (req, res) => {
  const { params } = req;
  const { latitud, longitud } = params;

  fetch(
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      latitud +
      "&lon=" +
      longitud +
      "&lang=es&exclude=current,minutely,hourly,alerts&units=metric&appid=073b5617fc4dbf48ce277078f57f3caf"
  ) // pronostico
    .then((Response) => Response.json())
    .then((data) => {
      res.send(data);
    });
});

app.get("/api/historico/:latitud&:longitud&:tiempo", (req, res) => {
  const { params } = req;
  const { latitud, longitud, tiempo } = params;

  fetch(
    "https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=" +
      latitud +
      "&lon=" +
      longitud +
      "&dt=" +
      tiempo +
      "&units=metric&lang=es&appid=073b5617fc4dbf48ce277078f57f3caf"
  ) // pronostico
    .then((Response) => Response.json())
    .then((data) => {
      res.send(data);
    });
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
