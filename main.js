const root = document.documentElement;
const trainMode = document.querySelector("#trainMode");
const destinoWrapper = document.querySelector(".destino-wrapper");
const terminarCiclo = document.querySelector(".terminarCiclo");
const train = document.querySelector("#train");
const start = document.querySelector("#start");
const stop = document.querySelector("#stop");
const finishCycle = document.querySelector(".terminarCiclo");
const destino = document.getElementById("destino");
        destino.disabled = true;

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

let trainStart = 20;
let trainEnd = 100;

/*Start*/
trainMode.addEventListener("click", () => {
    if (trainMode.checked) {
        terminarCiclo.disabled = false;
        destino.disabled = true;
        setTimeout(() => {
            start.disabled = false;
        }, 3000);
    } else {
        terminarCiclo.disabled = true;
        destino.disabled = false;
        train.style.animationName = "none";
        setTimeout(() => {
            start.disabled = false;
        }, 3000);
    }
});

let animations = ["st1", "st2", "st3", "st4", "st1r", "st2r", "st3r", "st4r"];
let positions = ["20%", "40%", "60%", "80%", "100%"];
let currentIndex = 0;
let animationTerminate = false;
const selectElement = document.getElementById("destino");


start.addEventListener("click", () => {
    start.disabled = true;
    animationTerminate = false;
    if (trainMode.checked) {
        playNextAnimation(animations, currentIndex);
    } else {
        let selectedIndex = selectElement.selectedIndex;
        document.documentElement.style.setProperty('--train-end', positions[selectedIndex]);
        train.style.animation = "0.5s linear 2s 1 both manual";
    }
});

/*Stop*/
stop.addEventListener("click", () => {
    const computedStyle = window.getComputedStyle(train).getPropertyValue("left");
    train.removeEventListener("animationend", onAnimationEndOnce);
    train.style.animation = "2s linear 1s 1 both reset";
    currentIndex = 0;
    train.style.left = computedStyle;
    setTimeout(() => {
        start.disabled = false;
    }, 4000);})

finishCycle.addEventListener("click", () => {
    animationTerminate = true;
    setTimeout(() => {
        start.disabled = false;
    }, 1000);});

function playNextAnimation(array, index) {
    train.style.animation = "0.5s linear 0.25s 1 both " + array[index];
    train.addEventListener("animationend", onAnimationEndOnce);
}

function onAnimationEndOnce() {
    currentIndex++
    if (currentIndex >= animations.length)
        currentIndex = 0;
    if (!(animationTerminate && currentIndex == 0)) {
        playNextAnimation(animations, currentIndex);
    }
}