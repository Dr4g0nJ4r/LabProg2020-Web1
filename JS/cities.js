var ciudades = [];
getCiudades()

//variables para exportar
/////////////////////////////////////
function getCiudad(id){
    fetch('./JS/listaCiudadesArgentina.json')
        .then(blob => blob.json())
        .then(data => {
            data.forEach(elemento => {
                if(elemento.id == this.id){
                    return elemento
                }
            });
        })
        .catch(err => console.log(err));
}

function getCiudades() {
    fetch('./JS/listaCiudadesArgentina.json')
        .then(blob => blob.json())
        .then(data => {
            setCiudades(data)
        })
        .catch(err => console.log(err));
}
//extrae los nombres de las ciudades de Argentina
function setCiudades(data) {
    for (ciudad in data) { ciudades.push(data[ciudad].name) }
}

function autocompletar(inp) {
    var arr = this.ciudades;
    var currentFocus;
    inp.addEventListener("input", function (e) {
        var lista, item, i, valor = this.value;
        cerrarTodaslasListas();
        if (!valor) { return false; }
        currentFocus = -1;
        lista = document.createElement("DIV");
        lista.setAttribute("id", this.id + "autocomplete-list");
        lista.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(lista);
        for (i = 0; i < arr.length; i++) {
            /*Controla si el item empieza con la misma letra que el campo de texto:*/
            if (arr[i].substr(0, valor.length).toUpperCase() == valor.toUpperCase()) {
                /*Crea una elemento de lista "DIV", por cada elemento:*/
                item = document.createElement("DIV");
                /*Hace que las letras que coninciden estén en negrita:*/
                item.innerHTML = "<strong>" + arr[i].substr(0, valor.length) + "</strong>";
                item.innerHTML += arr[i].substr(valor.length);
                /*Insterta en el arreglo aquellos items en el que conicida el valor:*/
                item.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*Ejecuta la funcion cuando se le da un click en el item:*/
                item.addEventListener("click", function (e) {
                    /*Inserta el valor para el campo de texto del autocompletado:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*Cierra la lista de los valores del autocompletado:*/
                    cerrarTodaslasListas();
                });
                lista.appendChild(item);
            }
        }
    });

    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            agregarActivo(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            agregarActivo(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    function agregarActivo(x) {
        if (!x) return false;
        removerActivo(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removerActivo(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function cerrarTodaslasListas(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        cerrarTodaslasListas(e.target);
    });
}