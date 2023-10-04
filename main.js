"use strict";
const start = document.querySelector("#start");
const stopButton = document.querySelector("#stop");
const reset = document.querySelector("#reset");
const train = document.querySelector(".train");
const finishCycle = document.querySelector(".terminarCiclo");
const mode = document.querySelector("#trainMode");
const luz = document.querySelector(".puertas");

let positions = ["0%", "20%", "40%", "60%", "80%", "100%",];
const cycle = ["20%", "40%", "60%", "80%", "100%", "80%", "60%", "40%", "20%"];

//PLC variables
let mem_posizioa;
let select_auto_man;
let seta;
let rearme;
let b1;
let b2;
let b3;
let b4;
let b5;

let animationInterval;

setInterval(() => {
    fetchData().then(()=> {
        if (select_auto_man && !seta) {
            mode.disabled = true;
            mode.checked = true;
            start.disabled = true;
            start.style.cursor = "not-allowed";
            finishCycle.disabled = false;
            finishCycle.style.cursor = "pointer";
            train.style.transition = "all 1000ms";
            playNextAnimation(cycle, mem_posizioa);

        } else {
            mode.checked = false;
            const selectElement = document.querySelector('select');
            const selectedIndex = selectElement.selectedIndex;
            train.style.transition = "all 1000ms";
            train.style.left = positions[selectedIndex];
        }
    }).catch(error => {console.log("Fetch error: " + error)})

}, 500);

start.addEventListener("click", () => {
    reset.disabled = true;
    reset.style.cursor = "not-allowed";
    postData(true);
    if (select_auto_man) {
        mode.disabled = true;
        start.disabled = true;
        start.style.cursor = "not-allowed";
        finishCycle.disabled = false;
        finishCycle.style.cursor = "pointer";

//        train.style.transition = "all 350ms";
//        playNextAnimation(cycle, MEM_POSIZIOA);
        animationInterval = setInterval(() => {
            console.log("inside auto")
            if (terminateCycle && MEM_POSIZIOA === 0) {
                clearInterval(animationInterval);
                train.style.left = positions[MEM_POSIZIOA];
                train.style.transition = "all 350ms";
//                terminateCycle = false;
            } else {
                train.style.transition = "all 1000ms";
                playNextAnimation(cycle, MEM_POSIZIOA);
            }

        }, 100);
    } else {
        const selectElement = document.querySelector('select');
        const selectedIndex = selectElement.selectedIndex;
        train.style.transition = "all 1000ms";
        train.style.left = positions[selectedIndex];
    }
});



reset.disabled = true;
reset.style.cursor = "not-allowed";
reset.addEventListener("click", () =>{
    clearInterval(animationInterval);
    train.style.left = "0%";
    train.style.transition = "all 2000ms";
    start.disabled = false;
    start.style.cursor = "pointer";
    reset.disabled = true;
    reset.style.cursor = "not-allowed";
    finishCycle.disabled = false;
    finishCycle.style.cursor = "pointer";
    luz.classList.remove("changeColor")
    postData("REARME",1);
});

stopButton.addEventListener("click", () => {
    clearInterval(animationInterval);
    luz.classList.remove("changeColor")
    start.disabled = false;
    start.style.cursor = "pointer";
    reset.disabled = false;
    reset.style.cursor = "pointer";
    finishCycle.disabled = true;
    finishCycle.style.cursor = "not-allowed";
    finishCycle.style.cursor = "not-allowed";
    mode.disabled = false;
    postData("SETA", 1)
});

finishCycle.addEventListener("click", () => {
    //TODO que variable corresponde a terminateCycle?
    //terminateCycle = true;
    start.disabled = false;
    start.style.cursor = "pointer";
});


function playNextAnimation(array, index) {
    train.style.transition = "all 1000ms";
    train.style.left = array[index];
    luz.classList.add("changeColor");

    destino.selectedIndex = positions.indexOf(array[index]);

    setTimeout(() => {luz.classList.toggle("changeColor");}, 4900);
}

/*Deshabilitar destino o ciclo*/
const destino = document.getElementById("destino")
destino.disabled = true;
destino.style.cursor = "not-allowed";

mode.addEventListener("change", () => {
    if (mode.checked) {
        postData("SELECT_AUTO/MAN", 1);
        destino.disabled = true;
        destino.style.cursor = "not-allowed";
        finishCycle.disabled = false;
        finishCycle.style.cursor = "pointer";
        train.style.left = positions[0];
        //TODO llamar fetch
        getMEM_POSIZIOA();
        playNextAnimation(cycle, MEM_POSIZIOA);
    } else {
        modificarSELEK_AUTO(false);
        destino.disabled = false;
        destino.style.cursor = "pointer";
        finishCycle.disabled = true;
        finishCycle.style.cursor = "not-allowed";
    }
});

/**/
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

function postData(variableName, value) {
    const data = new URLSearchParams();
    data.append('"mis_datos".SETA', true);

    fetch("index.html", {
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
            b1 = returnValueAsBoolean(div.querySelector("#B1").textContent);
            b2 = returnValueAsBoolean(div.querySelector("#B2").textContent);
            b3 = returnValueAsBoolean(div.querySelector("#B3").textContent);
            b4 = returnValueAsBoolean(div.querySelector("#B4").textContent);
            b5 = returnValueAsBoolean(div.querySelector("#B5").textContent);

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