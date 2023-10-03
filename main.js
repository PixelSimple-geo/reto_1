"use strict";
const start = document.querySelector("#start");
const stopButton = document.querySelector("#stop");
const reset = document.querySelector("#reset");
const train = document.querySelector(".train");
const finishCycle = document.querySelector(".terminarCiclo");
const mode = document.querySelector("#trainMode");

let positions = ["0%", "20%", "40%", "60%", "80%", "100%",];
const cycle = ["20%", "40%", "60%", "80%", "100%", "80%", "60%", "40%", "20%"];
let currentPosition = 0;
let animationInterval;
let terminateCycle = false;

// start
let pm;
let pausa;
// emergencia reset
let seta;
/*Paradas*/
let memPosizioa;
let p1;
let p2;
let p3;
let p4;
let p5;

start.addEventListener("click", () => {
    reset.disabled = true;
    if (mode.checked) {
        start.disabled = true;
        finishCycle.disabled = false;

        train.style.transition = "all 350ms";
        playNextAnimation(cycle, currentPosition);
        currentPosition++;
        animationInterval = setInterval(() => {
            if (terminateCycle && currentPosition === 0) {
                clearInterval(animationInterval);
                train.style.left = positions[currentPosition];
                train.style.transition = "all 350ms";
                terminateCycle = false;
            } else {
                train.style.transition = "all 350ms";
                playNextAnimation(cycle, currentPosition);
                currentPosition++;
            }
            if (currentPosition >= cycle.length) {
                currentPosition = 0;
            }
        }, 350);
    } else {
        const selectElement = document.querySelector('select');
        const selectedIndex = selectElement.selectedIndex;
        train.style.transition = "all 1000ms";
        train.style.left = positions[selectedIndex];
    }
});

reset.disabled = true;
reset.addEventListener("click", () =>{
    clearInterval(animationInterval);
    currentPosition = 0;
    start.disabled = false;
    train.style.left = "0%";
    train.style.transition = "all 2000ms";
    reset.disabled = true;
    finishCycle.disabled = false;
});

stopButton.addEventListener("click", () => {
    clearInterval(animationInterval);
    start.disabled = false;
    reset.disabled = false;
    finishCycle.disabled = true;
});

finishCycle.addEventListener("click", () => {
    terminateCycle = true;
    start.disabled = false;
});


function playNextAnimation(array, index) {
    train.style.left = array[index];
}

/*Deshabilitar destino o ciclo*/
const destino = document.getElementById("destino")
destino.disabled = true;

mode.addEventListener("change", () => {
    if (mode.checked) {
        destino.disabled = true;
        finishCycle.disabled = false;
    } else {
        destino.disabled = false;
        finishCycle.disabled = true;
    }
});

/**/
// Obtén referencias a los botones de parada
const parada1 = document.querySelector("#parada1");
const parada2 = document.querySelector("#parada2");
const parada3 = document.querySelector("#parada3");
const parada4 = document.querySelector("#parada4");
const parada5 = document.querySelector("#parada5");

// Agrega controladores de eventos de clic para los botones de parada
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
