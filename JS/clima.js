//archivo JS que controla todo lo referido a los datos del clima
//obtenidos desde una API. tendremos  tres grupos de datos.
//los datos del historico, actuales y el pronostico.

var historico = []; // 5 días antes...
var actual // datos actuales del clima
var pronostico // datos 5 días después..


obtenerDatos("Neuquén");//test

/*Esta funcion realiza todas las peticiones a la API del clima y las almacena para su posterior uso.
en cuanto a los datos del historico, realizar un llamado por cada día consultado hasta un maximo de 5 días antes
de la fecha actual, luego los ordena de menor a mayor*/ 
function obtenerDatos(ciudad){
    fetch("https://api.openweathermap.org/data/2.5/weather?q="+ciudad+"&units=metric&appid=073b5617fc4dbf48ce277078f57f3caf")
    .then(Response => Response.json())
    .then(data => {console.log(data);
        setActual(data);
        fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+this.actual.coord.lat+"&lon="+this.actual.coord.lon+"&exclude=current,minutely,hourly,alerts&units=metric&appid=073b5617fc4dbf48ce277078f57f3caf")// pronostico
        .then(Response => Response.json())
        .then(data => {console.log(data);
            setPronostico(data);
            llamadasHistorico().then(()=>{ordenarHistoricos();console.log(this.historico);});}//luego de completar las llamadas, procede a realizar el ordenamiento de los datos
            );
        })
    .catch(err => console.log(err))

}

//método por el cual se calcula el tiempo Unix (tiempo medido en segundos) de los 5 días previos al actual...
function tiempoUnix(t) {
    return Math.floor(Date.now() / 1000) - (86400 *t);// se restan el equivalente a "t" días en cantidad de segundos.
        
}

/*se realizan 5 llamadas a la API historico, uno por cada día antes de la fecha actual.
Este es un método asincronico, espera todas las respuestas de la API, antes de devolerlos*/
async function llamadasHistorico(){
    for(i=1;i<=5;i++){
        var respuesta = await fetch("https://api.openweathermap.org/data/2.5/onecall/timemachine?lat="+this.actual.coord.lat+"&lon="+this.actual.coord.lon+"&dt="+tiempoUnix(i)+"&units=metric&appid=073b5617fc4dbf48ce277078f57f3caf")//historico
        .then(Response => Response.json())
        .then(data => {console.log(data);
            console.log(data.current.dt)
            setHistorico(data)})
    }
    return respuesta;
}

//método para ordenar por días, desde el día mas cercano a la fecha actual, al más lejano (burbuja)
function ordenarHistoricos(){
    
    console.log("ordenar Historicos");
    var auxiliar;
    var i,j;
    for(i=1;i<=this.historico.length-1;i++){
        for (j = 0; j < this.historico.length-i; j++) {
            if(this.historico[j+1].current.dt<this.historico[j].current.dt){
                console.log(this.historico[j].current.dt);
                console.log(this.historico[j+1].current.dt)
                auxiliar=this.historico[j];
                this.historico[j]=this.historico[j+1];
                this.historico[j+1]=auxiliar;
            }
        }
    }
}

function setActual(datos){
    this.actual=datos;
}

function setPronostico(datos){
    this.pronostico=datos;
}

function setHistorico(datos){
    this.historico.push(datos);
    
    
}



    