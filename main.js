"use strict";
const start = document.querySelector("#start");
const stopButton = document.querySelector("#stop");
const train = document.querySelector(".train");
const finishCycle = document.querySelector(".terminarCiclo");
const mode = document.querySelector("#trainMode");

let positions = ["20%", "40%", "60%", "80%", "100%",];
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
    if (mode.checked) {
        start.disabled = true;
        finishCycle.disabled = false;
        animationInterval = setInterval(() => {
            train.style.transition = "all 350ms";
            playNextAnimation(cycle, currentPosition);
            currentPosition++;
            if (currentPosition >= cycle.length) {
                currentPosition = 0;
            }
            if (terminateCycle && currentPosition === 0) {
                clearInterval(animationInterval);
                train.style.left = cycle[currentPosition];
                train.style.transition = "all 350ms";
                terminateCycle = false;
            }
        }, 350);
    } else {
        const selectElement = document.querySelector('select');
        const selectedIndex = selectElement.selectedIndex;
        train.style.left = positions[selectedIndex];
    }
});

stopButton.addEventListener("click", () => {
    clearInterval(animationInterval);
    currentPosition = 0;
    start.disabled = false;
    train.style.left = "0%";
    train.style.transition = "all 2000ms";
});

finishCycle.addEventListener("click", () => {
    terminateCycle = true;
    start.disabled = false;
    if (currentPosition == 1){

    }
    setTimeout(() => {
        train.style.left = "0%";
        currentPosition = 0;
        train.style.transition = "all 2000ms";
    }, 3000);
});


function playNextAnimation(array, index) {
    if (!terminateCycle || index !== 0) {
        train.style.left = array[index];
    }
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