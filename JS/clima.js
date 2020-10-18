//archivo JS que controla todo lo referido a los datos del clima
//obtenidos desde una API. tendremos  tres grupos de datos.
//los datos del historico, actuales y el pronostico.

let historico; // 5 días antes...
let actual // datos actuales del clima
let pronostico // datos 5 días después..


fetch("https://api.openweathermap.org/data/2.5/weather?q=Neuquén&units=metric&appid=073b5617fc4dbf48ce277078f57f3caf")
    .then(Response => Response.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))

    