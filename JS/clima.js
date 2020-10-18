//archivo JS que controla todo lo referido a los datos del clima
//obtenidos desde una API. tendremos  tres grupos de datos.
//los datos del historico, actuales y el pronostico.

let historico; // 5 días antes...
let actual // datos actuales del clima
let pronostico // datos 5 días después..

/*
fetch("https://api.openweathermap.org/data/2.5/weather?q=Neuquén&units=metric&appid=073b5617fc4dbf48ce277078f57f3caf")
    .then(Response => Response.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
*/
function tiempoUnix() {
    //método por el cual se calcula el tiempo Unix (tiempo medido en segundos) de los 5 días previos al acual...    
}

function obtenerDatos(ciudad){
    fetch("https://api.openweathermap.org/data/2.5/weather?q="+ciudad+"&units=metric&appid=073b5617fc4dbf48ce277078f57f3caf")
    .then(Response => Response.json())
    .then(data => {console.log(data);
        setActual(data);

        fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+data.coord.lat+"&lon="+data.coord.lon+"&appid=073b5617fc4dbf48ce277078f57f3caf")// pronostico
        .then(Response => Response.json())
        .then(data => {console.log(data);
            setPronostico(datos);
            fetch("https://api.openweathermap.org/data/2.5/onecall/timemachine?lat="+data.coord.lat+"&lon="+data.coord.lon+"&dt={time}&appid=073b5617fc4dbf48ce277078f57f3caf")
            .then(Response => Response.json())
            .then(data => {console.log(data);
                setHistorico(data);})}
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
    this.historico=datos;
}

    