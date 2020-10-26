//archivo JS que controla todo lo referido a los datos del clima
//obtenidos desde una API. tendremos  tres grupos de datos.
//los datos del historico, actuales y el pronostico.

var historico = []; // 5 días antes...
var actual // datos actuales del clima
var pronostico // datos 7 días después..
var latitud //latitud de la ciudad
var longitud //longitud de la ciudad

////////////////////////////////////////////TEST/////////////////////////////////////////
//busco en el json las coordenadas de la ciudad y actualizo las variables longitud y latitud. (Test)

/*
fetch('./JS/listaCiudadesArgentina.json')
    .then(response => response.json())
    .then(obj => {
        for (x = 0; x <= obj.length; x++) {
            if (obj[x].name == "Neuquén") {
                this.latitud = obj[x].coord.lat;
                this.longitud = obj[x].coord.lon;
                ActualizarDatosTest("Neuquén"); //Test
            }
        }
    })*/
//funcion test solo para poder mostrar por formato de fecha los pronosticos y los historicos
function mostrarPorFecha(dato) {
    for (let x in dato) { console.log(tiempoDate(dato[x].dt)) }

}


/////////////////////////////TEST////////////////////////////////////////

function ActualizarDatosTest(ciudad) {
    actualizarActual(ciudad);
}

/*Método por el cual la pagina se puede actualizar con los datos de la ciudad requerida */
function ActualizarDatos() {
    let ciudad = document.getElementById("campoDeBusqueda").value
    actualizarActual(ciudad);
}




/*Esta funcion realiza todas las peticiones a la API del clima y las almacena para su posterior uso.
en cuanto a los datos del historico, realizar un llamado por cada día consultado hasta un maximo de 5 días antes
de la fecha actual, luego los ordena de menor a mayor*/
function actualizarActual(ciudad) {

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&appid=073b5617fc4dbf48ce277078f57f3caf`)
        .then(Response => Response.json())
        .then(data => {
            console.log(data);
            setActual(data);

            //Actualiza los datos del Panel Tiempo Actual (Panel Principal)
            refrescarPanelPrincipal(data);
            tiempoDate(data.dt); //TEST
            actualizarPronostico(data.coord.lat, data.coord.lon);
            actualizarHistorico(data.coord.lat, data.coord.lon);


        })
        .catch(err => console.log(err));

}
/*Funcion que me sirve para realizar un llamado a la API y pedir los datos del pronostico climático de los
próximos 7 días*/
function actualizarPronostico(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly,alerts&units=metric&appid=073b5617fc4dbf48ce277078f57f3caf") // pronostico
        .then(Response => Response.json())
        .then(data => {
            vaciarPronostico();
            setPronostico(data.daily);
            ordenarDatos(data.daily)
            console.log(this.pronostico);
            mostrarPorFecha(this.pronostico); //Test
        })
        .catch(err => console.log(err))

}


/*Función para obtener de la API los datos del clima histórico hasta 5 días antes de la fecha actual*/
function actualizarHistorico(lat, lon) {
    vaciarHistorico();
    this.llamadasHistorico(lat, lon).then(() => {
        this.ordenarDatos(this.historico);
        console.log(this.historico);
        mostrarPorFecha(this.historico) //TEST
    })

}

//método por el cual se calcula el tiempo Unix (tiempo medido en segundos) de los 5 días previos al actual...
function tiempoUnix(t) {
    return Math.floor(Date.now() / 1000) - (86400 * t); // se restan el equivalente a "t" días en cantidad de segundos.

}
//método por el cual se puede obtener la fecha a partir de un tiempo Unix..
function tiempoDate(t) {
    let fecha = new Date(t * 1000);
    console.log(fecha);
}

/*se realizan 5 llamadas a la API historico, uno por cada día antes de la fecha actual.
Este es un método asincronico, espera todas las respuestas de la API, antes de devolerlos*/
async function llamadasHistorico(lat, lon) {
    for (i = 1; i <= 5; i++) {
        var respuesta = await fetch("https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=" + lat + "&lon=" + lon + "&dt=" + tiempoUnix(i) + "&units=metric&appid=073b5617fc4dbf48ce277078f57f3caf") //historico
            .then(Response => Response.json())
            .then(data => {
                console.log(data);
                setHistorico(data.current)
            })
    }
    return respuesta;
}


//método que ordena por fecha los datos let pronostico y el historico
function ordenarDatos(dato) {
    console.log("ordenar pronostico");
    var auxiliar;
    var i, j;
    for (i = 1; i <= dato.length - 1; i++) {
        for (j = 0; j < dato.length - i; j++) {
            if (dato[j + 1].dt < dato[j].dt) {
                auxiliar = dato[j];
                dato[j] = dato[j + 1];
                dato[j + 1] = auxiliar;
            }
        }
    }
}


function setActual(datos) {
    this.actual = datos;
}

function setPronostico(datos) {

    this.pronostico = datos;
}
function vaciarPronostico() {
    this.pronostico = [];
}

function setHistorico(datos) {

    this.historico.push(datos);


}
function vaciarHistorico() {
    this.historico = [];
}

function getActual() {
    return this.actual;
}

function getPronostico() {
    return this.pronostico;
}

function getHistorico() {
    return this.historico;
}

function refrescarPanelPrincipal(data) {
    document.getElementById("valor_temperatura").innerHTML = `${data.main.temp} °C`;
    document.getElementById("valor_presion").innerHTML = `${data.main.pressure} hP`;
    document.getElementById("valor_humedad").innerHTML = `${data.main.humidity} %`;
    let deg = data.wind.deg;
    switch (deg) {
        case deg < 180:
            document.getElementById("logo_viento").src = `iconos/wind/001-down-arrow.png`;
            break;

        default:
            document.getElementById("logo_viento").src = `iconos/002-wind.png`;
            break;
    }
    document.getElementById("valor_viento").innerHTML = `${data.wind.speed} km/h`;

}