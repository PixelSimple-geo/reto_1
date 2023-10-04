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
    reset.style.cursor = "not-allowed";
    if (mode.checked) {
        start.disabled = true;
        start.style.cursor = "not-allowed";
        finishCycle.disabled = false;
        finishCycle.style.cursor = "pointer";


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

        }, 5000);
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
    currentPosition = 0;
    train.style.left = "0%";
    train.style.transition = "all 2000ms";
    start.disabled = false;
    start.style.cursor = "pointer";
    reset.disabled = true;
    reset.style.cursor = "not-allowed";
    finishCycle.disabled = false;
    finishCycle.style.cursor = "pointer";
    luz.classList.remove("changeColor")
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
});

finishCycle.addEventListener("click", () => {
    terminateCycle = true;
    start.disabled = false;
    start.style.cursor = "pointer";
});


function playNextAnimation(array, index) {
    train.style.left = array[index];
    luz.classList.add("changeColor");
    setTimeout(() => {
        luz.classList.toggle("changeColor");
        }, 4900);
}

/*Deshabilitar destino o ciclo*/
const destino = document.getElementById("destino")
destino.disabled = true;
destino.style.cursor = "not-allowed";

mode.addEventListener("change", () => {
    if (mode.checked) {
        destino.disabled = true;
        destino.style.cursor = "not-allowed";
        finishCycle.disabled = false;
        finishCycle.style.cursor = "pointer";
    } else {
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