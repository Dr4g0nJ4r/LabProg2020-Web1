var ciudades = [];
getCiudades()

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
    inp.addEventListener("input", function(e) {
        var lista, item, i, valor = this.value;
        cerrarTodaslasListas();
        if (!valor) { return false; }
        currentFocus = -1;
        lista = document.createElement("DIV");
        lista.setAttribute("id", this.id + "autocomplete-list");
        lista.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(lista);
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, valor.length).toUpperCase() == valor.toUpperCase()) {
                /*create lista DIV element for each matching element:*/
                item = document.createElement("DIV");
                /*make the matching letters bold:*/
                item.innerHTML = "<strong>" + arr[i].substr(0, valor.length) + "</strong>";
                item.innerHTML += arr[i].substr(valor.length);
                /*insert lista input field that will hold the current array item's value:*/
                item.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute lista function when someone clicks on the item value (DIV element):*/
                item.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    cerrarTodaslasListas();
                });
                lista.appendChild(item);
            }
        }
    });
    /*execute lista function presses lista key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            agregarActivo(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            agregarActivo(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate lista click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function agregarActivo(x) {
        /*lista function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removerActivo(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removerActivo(x) {
        /*lista function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function cerrarTodaslasListas(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute lista function when someone clicks in the document:*/
    document.addEventListener("click", function(e) {
        cerrarTodaslasListas(e.target);
    });
}