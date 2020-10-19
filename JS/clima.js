//archivo JS que controla todo lo referido a los datos del clima
//obtenidos desde una API. tendremos  tres grupos de datos.
//los datos del historico, actuales y el pronostico.

let historico=[]; // 5 días antes...
let actual // datos actuales del clima
let pronostico // datos 5 días después..

/*
fetch("https://api.openweathermap.org/data/2.5/weather?q=Neuquén&units=metric&appid=073b5617fc4dbf48ce277078f57f3caf")
    .then(Response => Response.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
*/
function tiempoUnix(t) {
    //método por el cual se calcula el tiempo Unix (tiempo medido en segundos) de los 5 días previos al acual...
    return Math.floor(Date.now() / 1000) - (86400 *t);// se restan el equivalente a 5 días en cantidad de segundos
        
}

function llamadasHistorico(){
    //se realizan 5 llamadas a la API historico, uno por cada día antes de la fecha actual.
    for(i=0;i<5;i++){
        
        fetch("https://api.openweathermap.org/data/2.5/onecall/timemachine?lat="+this.actual.coord.lat+"&lon="+this.actual.coord.lon+"&dt="+tiempoUnix(i)+"&units=metric&appid=073b5617fc4dbf48ce277078f57f3caf")//historico
        .then(Response => Response.json())
        .then(data => {console.log(data);
                setHistorico(data);})
    }
    

}

console.log("tiempo actual = " + Math.floor(Date.now() / 1000))
console.log("tiempo 5 días atras = " + (Math.floor(Date.now() / 1000) - (86400 *5)))


obtenerDatos("Neuquén");//test


function obtenerDatos(ciudad){
    fetch("https://api.openweathermap.org/data/2.5/weather?q="+ciudad+"&units=metric&appid=073b5617fc4dbf48ce277078f57f3caf")
    .then(Response => Response.json())
    .then(data => {console.log(data);
        setActual(data);
        fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+this.actual.coord.lat+"&lon="+this.actual.coord.lon+"&exclude=current,minutely,hourly,alerts&units=metric&appid=073b5617fc4dbf48ce277078f57f3caf")// pronostico
        .then(Response => Response.json())
        .then(data => {console.log(data);
            setPronostico(data);
            tiempoUnix();//actualiza el tiempo a 5 días atras de la fecha actual
            llamadasHistorico();}
            );
        })
    .catch(err => console.log(err))

}


function setActual(datos){
    this.actual=datos;
}

function setPronostico(datos){
    this.pronostico=datos;
}

function setHistorico(datos){
    this.historico.append(datos);
}

    