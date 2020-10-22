//archivo JS que controla todo lo referido a los datos del clima
//obtenidos desde una API. tendremos  tres grupos de datos.
//los datos del historico, actuales y el pronostico.

var historico = []; // 5 días antes...
var actual // datos actuales del clima
var pronostico // datos 7 días después..
var latitud  //latitud de la ciudad
var longitud  //longitud de la ciudad
////////////////////////////////////////////TEST/////////////////////////////////////////
//busco en el json las coordenadas de la ciudad y actualizo las variables longitud y latitud. (Test)

fetch('./JS/listaCiudadesArgentina.json')
    .then(response => response.json())
    .then(obj => {
        for(x=0; x<=obj.length;x++){
            if(obj[x].name == "Neuquén"){
                this.latitud=obj[x].coord.lat;
                this.longitud=obj[x].coord.lon;
                ActualizarDatos("Neuquén",this.longitud,this.latitud);//Test
                console.log("exito"+obj[x].name+obj[x].coord.lat+" "+obj[x].coord.lon)}}})
/////////////////////////////TEST////////////////////////////////////////
 


/*Método por el cual la pagina se puede actualizar con los datos de la ciudad requerida */
function ActualizarDatos(ciudad,lat,lon){
    actualizarActual(ciudad);
    actualizarPronostico(lat,lon);
    actualizarHistorico(lat,lon);
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

            setTemperature(data.main.temp);
            setTempMin(data.main.temp_min);
            setTempMax(data.main.temp_max);
            setWind(data.main.wind.speed,data.main.wind.deg);
            setRain()
            setSnow()
            setHumidity(data.main.humidity);
            setPressure(data.main.pressure);


        })
        .catch(err => console.log(err));

}
/*Funcion que me sirve para realizar un llamado a la API y pedir los datos del pronostico climático de los
próximos 7 días*/
function actualizarPronostico(lat,lon){
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=current,minutely,hourly,alerts&units=metric&appid=073b5617fc4dbf48ce277078f57f3caf") // pronostico
                .then(Response => Response.json())
                .then(data => {
                    console.log(data);
                    setPronostico(data);
                })
                .catch(err => console.log(err))

}


/*Función para obtener de la API los datos del clima histórico hasta 5 días antes de la fecha actual*/
function actualizarHistorico(lat,lon){
    this.llamadasHistorico(lat,lon).then(()=>{this.ordenarHistoricos();})

}

//método por el cual se calcula el tiempo Unix (tiempo medido en segundos) de los 5 días previos al actual...
function tiempoUnix(t) {
    return Math.floor(Date.now() / 1000) - (86400 * t); // se restan el equivalente a "t" días en cantidad de segundos.

}

/*se realizan 5 llamadas a la API historico, uno por cada día antes de la fecha actual.
Este es un método asincronico, espera todas las respuestas de la API, antes de devolerlos*/
async function llamadasHistorico(lat,lon) {
    for (i = 1; i <= 5; i++) {
        var respuesta = await fetch("https://api.openweathermap.org/data/2.5/onecall/timemachine?lat="+lat+"&lon="+lon+"&dt="+tiempoUnix(i)+"&units=metric&appid=073b5617fc4dbf48ce277078f57f3caf") //historico
            .then(Response => Response.json())
            .then(data => {
                console.log(data);
                console.log(data.current.dt)
                setHistorico(data)
            })
    }
    return respuesta;
}

//método para ordenar por días, desde el día mas cercano a la fecha actual, al más lejano (burbuja)
function ordenarHistoricos() {

    console.log("ordenar Historicos");
    var auxiliar;
    var i, j;
    for (i = 1; i <= this.historico.length - 1; i++) {
        for (j = 0; j < this.historico.length - i; j++) {
            if (this.historico[j + 1].current.dt < this.historico[j].current.dt) {
                console.log(this.historico[j].current.dt);
                console.log(this.historico[j + 1].current.dt)
                auxiliar = this.historico[j];
                this.historico[j] = this.historico[j + 1];
                this.historico[j + 1] = auxiliar;
            }
        }
    }
}

function setActual(datos) {
    this.actual = datos;
    setTemperature(19);
    setWind(20, 90);
}

function setPronostico(datos) {
    this.pronostico = datos;
}

function setHistorico(datos) {
    this.historico.push(datos);


}

function getActual(){
    return this.actual;
}

function getPronostico(){
    return this.pronostico;
}

function getHistorico(){
    return this.historico;
}
// FUNCIONES PARA MODIFICAR HTML
function setTemperature(temp) {

}

function setTempMin(temp) {

}

function setTempMax(temp) {

}

function setWind(speed,deg) {
    switch (deg) {
        case deg < 180:
            document.getElementById("logo_viento").src = `iconos/wind/001-down-arrow.png`;
            break;

        default:
            document.getElementById("logo_viento").src = `iconos/002-wind.png`;
            break;
    }
    document.getElementById("valor_viento").innerHTML = `${speed} km/h`;
}

function setRain(rain) {

}

function setSnow(snow) {

}

function setHumidity(humidity) {

}

function setPressure(pressure) {

}
