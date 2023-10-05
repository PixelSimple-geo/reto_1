"use strict";
const start = document.querySelector("#start");
const stopButton = document.querySelector("#stop");
const reset = document.querySelector("#reset");
const train = document.querySelector(".train");
const finishCycle = document.querySelector(".terminarCiclo");
const mode = document.querySelector("#trainMode");
const luz = document.querySelector(".puertas");
const selectElement = document.querySelector("#destino");


let positions = ["0%", "20%", "40%", "60%", "80%", "100%",];
const cycle = ["20%", "40%", "60%", "80%", "100%", "80%", "60%", "40%", "20%"];


/*Botones inhabilitados*/
reset.disabled = true;
reset.style.cursor = "not-allowed";
finishCycle.disabled = true;
finishCycle.style.cursor = "not-allowed"

//PLC variables
let mem_posizioa;
let select_auto_man;
let pm;
let seta;
let rearme;
let pfc;
const paradas = [
    {name : "B0", value: undefined},
    {name : "B1", value: undefined},
    {name : "B2", value: undefined},
    {name : "B3", value: undefined},
    {name : "B4", value: undefined},
    {name : "B5", value: undefined},
];

let stopCounts = {
    "20%": 0,
    "40%": 0,
    "60%": 0,
    "80%": 0,
    "100%": 0,
};

fetchData().then(() => {
   if (select_auto_man)
       mode.checked = true;
   else
       mode.checked = false;
});

setInterval(() => {
    fetchData().then(()=> {
        if (seta && rearme) {
            train.style.transition = "all 2000ms";
            train.style.left = positions[0];
            postData("SETA", false);
            postData("REARME", false);
        }
        else if (select_auto_man) {
            finishCycle.disabled = false;
            finishCycle.style.cursor = "pointer"
            destino.disabled = true;
            destino.style.cursor = "not-allowed"

            if (pfc === true && mem_posizioa === 0) {
                train.style.left = positions[1];
                setTimeout(() => {train.style.left = positions[0];}, 2000);
                postData("PFC", false);
                postData("PM", false);
            } else if (pm) {
                train.style.transition = "all 1000ms";
                playNextAnimation(cycle, mem_posizioa);
            }
        } else if (!select_auto_man) {
            reset.disabled = true;
            reset.style.cursor = "not-allowed";
            finishCycle.disabled = true;
            finishCycle.style.cursor = "not-allowed"

            if (pm) {
                train.style.transition = "all 1000ms";
                for (let i = 0; i < paradas.length; i++) {
                    if (paradas[i].value === true)
                        train.style.left = positions[i];
                }
            }

        }
    }).catch(error => {console.log("Fetch error: " + error)})

}, 500);

function incrementStopCount(location) {
    stopCounts[location]++;
    localStorage.setItem("stopCounts", JSON.stringify(stopCounts));
    updateStopCountDisplay();
}

// Initialize stop counts on page load
window.onload = function () {
    if (localStorage.getItem("stopCounts")) {
        stopCounts = JSON.parse(localStorage.getItem("stopCounts"));
        updateStopCountDisplay();
    }
};

// Function to update the stop count display
function updateStopCountDisplay() {
    for (const location in stopCounts) {
        const count = stopCounts[location];
        const countElement = document.getElementById(`count-${location}`);
        if (countElement) {
            countElement.textContent = count;
        }
    }
}



/*Boton start*/
start.addEventListener("click", () => {
    if (mode.checked) {
        postData("PM", true);
        postData("SETA", false);
        postData("REARME", false);
        start.disabled = true;
        start.style.cursor = "not-allowed"
        reset.disabled = true;
        reset.style.cursor = "not-allowed"
        finishCycle.disabled = false;
        finishCycle.style.cursor = "pointer"
    } else {
        let parameters = [];
        postData("PM", true)
        postData("SETA", false);
        postData("REARME", false);
        for(let i = 0; i < paradas.length; i++) {
            if (i !== selectElement.selectedIndex)
                paradas[i].value = false;
        }
        paradas[selectElement.selectedIndex].value = true;
        postParadas();
    }
});

reset.addEventListener("click", () => {
    if (seta === true) {
        postData("REARME", true);
    }
});

stopButton.addEventListener("click", () => {
    postData("SETA", true)
    postData("PM", false);
    start.disabled = false;
    start.style.cursor = "pointer"
    reset.disabled = false;
    reset.style.cursor = "pointer"
    finishCycle.disabled = true;
    finishCycle.style.cursor = "not-allowed"
});

finishCycle.addEventListener("click", () => {
    if (!seta){
        postData("PFC", true);
        reset.disabled = true;
        reset.style.cursor = "not-allowed"
    }
});

mode.addEventListener("change", () => {
    if (mode.checked) {
        postData("SELEK_AUTO/MAN", true);
        postData("PM", false);
        train.style.left = positions[0];
        for (let i = 0; i < paradas.length; i++) {
            paradas[i].value = false
        }
        postParadas();
    } else {
        postData("SELEK_AUTO/MAN", false)
        postData("PM", false);
        train.style.left = positions[0];
        for (let i = 0; i < paradas.length; i++) {
            paradas[i].value = false
        }
        postParadas();
    }
});



/*Deshabilitar destino o ciclo*/
const destino = document.getElementById("destino");

/*
// Obtén referencias a los botones de parada
const parada0 = document.querySelector("#parada0");
const parada1 = document.querySelector("#parada1");
const parada2 = document.querySelector("#parada2");
const parada3 = document.querySelector("#parada3");
const parada4 = document.querySelector("#parada4");
const parada5 = document.querySelector("#parada5");

// Agrega controladores de eventos de clic para los botones de parada
parada0.addEventListener("click", () => {
    if (!mode.checked){
        train.style.transition = "all 1000ms";
        train.style.left = positions[0];
    }
});
parada1.addEventListener("click", () => {
    if (!mode.checked){
        train.style.transition = "all 1000ms";
        train.style.left = positions[1];
    }
});

parada2.addEventListener("click", () => {
    if (!mode.checked) {
        train.style.transition = "all 1000ms";
        train.style.left = positions[2];
    }

});

parada3.addEventListener("click", () => {
    if (!mode.checked) {
        train.style.transition = "all 1000ms";
        train.style.left = positions[3];
    }
});

parada4.addEventListener("click", () => {
    if (!mode.checked) {
        train.style.transition = "all 1000ms";
        train.style.left = positions[4];
    }
});

parada5.addEventListener("click", () => {
    if (!mode.checked) {
        train.style.transition = "all 1000ms";
        train.style.left = positions[5];
    }
});
 */

/*
function postData(variableName, value) {
    const data = new URLSearchParams();
    data.append('"mis_datos".'+variableName, value);

    fetch("http://10.0.2.100/awp/pruebas/index.html", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .catch((error) => {
            console.error('Fetch Error:', error);

        });
}
 */

function postData(variableName, value) {
    const xhr = new XMLHttpRequest();
    const url = "http://10.0.2.100/awp/pruebas/index.html";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log("Request successful");
            } else {
                console.error("Network response was not ok");
            }
        }
    };
    const data = new URLSearchParams();
    data.append('"mis_datos".'+variableName.toUpperCase(), value);
    xhr.send(data);
}

function postParadas() {
    const xhr = new XMLHttpRequest();
    const url = "http://10.0.2.100/awp/pruebas/index.html";

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log("Request successful");
            } else {
                console.error("Network response was not ok");
            }
        }
    };
    const data = new URLSearchParams();
    for (let i = 0; i < paradas.length; i++) {
        data.append('"mis_datos".'+paradas[i].name.toUpperCase(), paradas[i].value);
    }

    xhr.send(data);
}

async function fetchData() {
    console.log("making request")
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "output_variables.html", true);
    xhr.setRequestHeader("Cache-Control", "no-store");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let div = document.createElement("div");
            div.innerHTML = xhr.responseText;

            mem_posizioa = parseInt(div.querySelector("#MEM_POSIZIOA").textContent) - 1;
            select_auto_man = returnValueAsBoolean(div.querySelector("#SELEK_AUTO_MAN").textContent);
            seta = returnValueAsBoolean(div.querySelector("#SETA").textContent);
            rearme = returnValueAsBoolean(div.querySelector("#REARME").textContent);
            paradas[1].value = returnValueAsBoolean(div.querySelector("#B1").textContent);
            paradas[2].value = returnValueAsBoolean(div.querySelector("#B2").textContent);
            paradas[3].value = returnValueAsBoolean(div.querySelector("#B3").textContent);
            paradas[4].value = returnValueAsBoolean(div.querySelector("#B4").textContent);
            paradas[5].value = returnValueAsBoolean(div.querySelector("#B5").textContent);
            pfc = returnValueAsBoolean(div.querySelector("#PFC").textContent);
            pm = returnValueAsBoolean(div.querySelector("#PM").textContent);
        }
    };
    xhr.send();
}

function returnValueAsBoolean(value) {
    value = parseInt(value);
    if (value === 1)
        return true;
    return false;
}

function playNextAnimation(array, index) {
    train.style.transition = "all 1000ms";
    train.style.left = array[index];
    destino.selectedIndex = positions.indexOf(array[index]);
    incrementStopCount(location);

    luz.classList.add("changeColor");
    setTimeout(() => {luz.classList.toggle("changeColor");}, 4900);
}