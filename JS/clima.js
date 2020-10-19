//archivo JS que controla todo lo referido a los datos del clima
//obtenidos desde una API. tendremos  tres grupos de datos.
//los datos del historico, actuales y el pronostico.

var historico = []; // 5 días antes...
let actual // datos actuales del clima
let pronostico // datos 5 días después..

function tiempoUnix(t) {
    //método por el cual se calcula el tiempo Unix (tiempo medido en segundos) de los 5 días previos al acual...
    return Math.floor(Date.now() / 1000) - (86400 *t);// se restan el equivalente a 5 días en cantidad de segundos
        
}

async function llamadasHistorico(){
    //se realizan 5 llamadas a la API historico, uno por cada día antes de la fecha actual.
    for(i=1;i<=5;i++){
        fetch("https://api.openweathermap.org/data/2.5/onecall/timemachine?lat="+this.actual.coord.lat+"&lon="+this.actual.coord.lon+"&dt="+tiempoUnix(i)+"&units=metric&appid=073b5617fc4dbf48ce277078f57f3caf")//historico
        .then(Response => Response.json())
        .then(data => {console.log(data);
            setHistorico(data)})
    }
    console.log(this.historico);
    
    
}


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
            llamadasHistorico().then(ordenarHistoricos());}
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
    this.historico.push(datos);
    
}

function ordenarHistoricos(){
    //método para ordenar por días, desde el día mas cercano a la fecha actual, al más lejano
    console.log("ordenar Historicos");
    let auxiliar;
    for(i=0;i<=this.historico.lenght-1;i++){
        for (let j = i+1; j < this.historico.length; j++) {
            if(this.historico[i].current.dt<this.historico[j].current.dt){
                auxiliar=this.historico[i];
                this.historico[i]=this.historico[j];
                this.historico[j]=auxiliar;
            }
        }
    }
    console.log(this.historico);
}

    