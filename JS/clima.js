//archivo JS que controla todo lo referido a los datos del clima
//obtenidos desde una API. tendremos  tres grupos de datos.
//los datos del historico, actuales y el pronostico.

var historico = []; // 5 días antes...
var actual // datos actuales del clima
var pronostico // datos 7 días después..
var latitud = -38.95; //latitud de la ciudad de Neuquén
var longitud = -68.06; //longitud de la ciudad de Neuquén
var ciudadActual = "Neuquén";



/*Método por el cual la pagina se puede actualizar con los datos de la ciudad requerida */
function ActualizarDatos(ciudad) {
    this.ciudadActual = ciudad;
    actualizarActual(ciudad);
}



/*Esta funcion realiza todas las peticiones a la API del clima y las almacena para su posterior uso.
en cuanto a los datos del historico, realizar un llamado por cada día consultado hasta un maximo de 5 días antes
de la fecha actual, luego los ordena de menor a mayor*/
function actualizarActual(ciudad) {

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&lang=es&appid=073b5617fc4dbf48ce277078f57f3caf`)
        .then(Response => Response.json())
        .then(data => {
            setActual(data);
            this.latitud = data.coord.lat;
            this.longitud = data.coord.lon;
            actualizarPronostico(this.latitud, this.longitud)
            actualizarHistorico(this.latitud, this.longitud)
            //Actualiza los datos del Panel Tiempo Actual (Panel Principal)
            refrescarPanelPrincipal(data);
        })
        .catch(err => console.log(err));

}
/*Funcion que me sirve para realizar un llamado a la API y pedir los datos del pronostico climático de los
próximos 7 días*/
function actualizarPronostico(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&lang=es&exclude=current,minutely,hourly,alerts&units=metric&appid=073b5617fc4dbf48ce277078f57f3caf") // pronostico
        .then(Response => Response.json())
        .then(data => {
            vaciarPronostico();
            setPronostico(data.daily);
            ordenarDatos(data.daily);
            refrescarPanelPronostico();
        })
        .catch(err => console.log(err))

}


/*Función para obtener de la API los datos del clima histórico hasta 5 días antes de la fecha actual*/
function actualizarHistorico(lat, lon) {
    vaciarHistorico();
    this.llamadasHistorico(lat, lon).then(() => {
        this.ordenarDatos(this.historico);
        llenarListaHistorial(this.historico)
        refrescarPanelHistorial(this.ciudadActual)
    })

}

//método por el cual se calcula el tiempo Unix (tiempo medido en segundos) de los 5 días previos al actual...
function tiempoUnix(t) {
    return Math.floor(Date.now() / 1000) - (86400 * t); // se restan el equivalente a "t" días en cantidad de segundos.

}
//método por el cual se puede obtener la fecha a partir de un tiempo Unix..
function tiempoDate(t) {
    let fecha = new Date(t * 1000);
    return fecha;
}
//método para obtener fecha en formato DD/MM/AAAA
function obtenerFecha(t) {
    var fecha = tiempoDate(t);
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1;
    var año = fecha.getFullYear();
    return (dia + "/" + mes + "/" + año);
}

function obtenerFechaSinAnio(t) {
    var fecha = tiempoDate(t);
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1;
    return (dia + "/" + mes);
}
//método para obtener la hora en formato HH/MM/SS
function obtenerHora(t) {
    var fecha = tiempoDate(t);
    var hora = fecha.getHours();
    var min = fecha.getMinutes();
    var seg = fecha.getSeconds();
    return (hora + ":" + min + ":" + seg);
}

/*se realizan 5 llamadas a la API historico, uno por cada día antes de la fecha actual.
Este es un método asincronico, espera todas las respuestas de la API, antes de devolerlos*/
async function llamadasHistorico(lat, lon) {
    for (i = 1; i <= 5; i++) {
        var respuesta = await fetch("https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=" + lat + "&lon=" + lon + "&dt=" + tiempoUnix(i) + "&units=metric&lang=es&appid=073b5617fc4dbf48ce277078f57f3caf") //historico
            .then(Response => Response.json())
            .then(data => {
                setHistorico(data.current)
            })
    }
    return respuesta;
}


//método que ordena por fecha los datos let pronostico y el historico
function ordenarDatos(dato) {
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


//Método para poder llenar la lista de historial
function llenarListaHistorial(dato) {
    var ul = document.getElementById("lista-Historial");
    ul.innerHTML = ''; //se asegura que no tenga contenido antes de agregar más items de la lista.
    for (x in dato) {
        let li = document.createElement("li");
        li.className = "elemento-lista";
        li.appendChild(document.createTextNode(obtenerFecha(dato[x].dt) + "-" + "Temperatura: " + dato[x].temp + " °C " + "- Viento: " + velocidadViento(dato[x].wind_speed) + " Km/h " + dato[x].humidity + " % - " + dato[x].weather[0].description));
        ul.appendChild(li)
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



function vectorViento(degree) {
    let vector;
    console.log(degree);
    console.log(Math.round(degree / 45));
    switch (Math.round(degree / 45)) {
        case 0:
            vector = "N";
            break;
        case 1:
            vector = "NE";
            break;
        case 2:
            vector = "E";
            break;
        case 3:
            vector = "SE";
            break;
        case 4:
            vector = "S";
            break;
        case 5:
            vector = "SO";
            break;
        case 6:
            vector = "O";
            break;
        case 7:
            vector = "NO";
            break;
        default:
            break;
    }
    return vector;
}

function velocidadViento(speed) {
    return Math.round(speed * 3.6);
}

function refrescarPanelPrincipal(data) {
    console.log(data);
    //Panel ciudad y fecha
    document.getElementById("fechaActual").innerHTML = `Hoy ${obtenerFecha(data.dt)}`;
    document.getElementById("nombreCiudad").innerHTML = `${data.name}, ${data.sys.country}`;
    document.getElementById("iconoClima").src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById("resumenClima").innerHTML = `${data.weather[0].main}`;
    document.getElementById("descripcionClima").innerHTML = `${data.weather[0].description}`;
    //Panel temperatura
    document.getElementById("temperaturaActual").innerHTML = `${data.main.temp} °C`;
    document.getElementById("temperaturaMaxima").innerHTML = `Máx: ${data.main.temp_max} °C`;
    document.getElementById("temperaturaMinima").innerHTML = `Mín: ${data.main.temp_min} °C`;
    document.getElementById("sensacionTermicaActual").innerHTML = `Sensación térmica ${data.main.feels_like} °C`;
    //Panel viento
    document.getElementById("vectorViento").innerHTML = `${velocidadViento(data.wind.speed)} km/H ${vectorViento(data.wind.deg)}`;
    document.getElementById("iconoViento").src = `iconos/wind/${vectorViento(data.wind.deg)}.png`;
    //Panel Humedad
    document.getElementById("humedadActual").innerHTML = `Humedad: ${data.main.humidity} %`;
    document.getElementById("presionActual").innerHTML = `Presión: ${data.main.pressure} hPa`;
    //Panel Salida Sol-Puesta Sol
    document.getElementById("tiempoSunrise").innerHTML = `${obtenerHora(data.sys.sunrise)}`;
    document.getElementById("tiempoSunset").innerHTML = `${obtenerHora(data.sys.sunset)}`;
}

function refrescarPanelPronostico() {
    var btnGroup = document.getElementById("btn-group-pronostico");
    btnGroup.innerHTML = '';
    saltoPrimerDia = true;
    for (x in pronostico) {
        let btn = document.createElement("button");
        btn.value = obtenerFechaSinAnio(pronostico[x].dt);
        btn.className = "btn btn-secondary";
        //btn.addEventListener("onclick", function() { obtenerFechaSinAnio(btn.value) }, false)
        btn.textContent = obtenerFechaSinAnio(pronostico[x].dt);
        btn.onclick = function () { refrescarDatosPronostico(this.value) };
        btnGroup.appendChild(btn);
    }
    refrescarDatosPronostico(obtenerFechaSinAnio(pronostico[1].dt));

}

function refrescarDatosPronostico(fecha) {
    console.log(fecha);
    for (x in pronostico) {
        if (obtenerFechaSinAnio(pronostico[x].dt) == fecha) {
            document.getElementById("logoPronostico").src = `http://openweathermap.org/img/wn/${pronostico[x].weather[0].icon}@2x.png`;
            document.getElementById("descripcionPronostico").innerHTML = `${pronostico[x].weather[0].description}`;
            document.getElementById("tempPronostico").innerHTML = `Temperatura: ${pronostico[x].temp.day}`;
            document.getElementById("vientoPronostico").innerHTML = `Viento: ${velocidadViento(pronostico[x].wind_speed)} ${vectorViento(pronostico[x].wind_deg)}`;
            document.getElementById("humedadPronostico").innerHTML = `Humedad: ${pronostico[x].humidity}%`;


        }
    }
}

function refrescarPanelHistorial(data) {
    document.getElementById("ciudad").innerHTML = data;
}
