//Archivo que controla los modelos de validación de los JSON, tanto como en estructura, como por sus tipos de datos.
//para ser usados en los endpoints del proyecto.
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
module.exports = {
  jsonSchemaCrearCiudad: {
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
  },

  /*
  Esquema json para actualizar ciudad
  */
  jsonSchemaActualizarCiudad: {
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
  },
  /*
      Esquema de la consulta GET Pronóstico
      */
  querySchemaConsulta: {
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
  },
};
