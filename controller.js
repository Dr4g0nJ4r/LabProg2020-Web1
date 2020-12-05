//CONTROLADOR
//contiene toda la logica de los endpoints.
const listaCiudades = require("./JS/listaCiudadesArgentina.json");
const fetch = require("node-fetch");

/*
  Endpoint get que permite consultar varias ciudades.
  Estructura: api/ciudad?cantidad={cantidad de ciudades a retornar}&desde={desde que ciudad se retorna}

*/
module.exports = listaDeFunciones = {
  getCiudadesPorRango: function (req, res) {
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
  },
  //Obtener ciudades por id
  getCiudadesPorId: function (req, res) {
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
  },
  //Publica una nueva ciudad POST. Se valida con el jsonSchema para verificar campos y valores
  postCiudad: function (req, res) {
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
  },
  //Publica un endpoint para actualizar datos de la ciudad. Se valida con el jsonSchema para verificar campos y valores
  actualizarCiudad: function (req, res) {
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
  },
  //CONSULTA PRONOSTICOS

  consultaPronosticos: function (req, res) {
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
  },
  getDatosClimaActual: function (req, res) {
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
  },
  getPronosticos: function (req, res) {
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
  },
  getHistoricos: function (req, res) {
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
  },
};
