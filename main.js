const trainMode = document.querySelector("#trainMode");
const destinoWrapper = document.querySelector(".destino-wrapper");
const terminarCiclo = document.querySelector(".terminarCiclo");
const train = document.querySelector("#train");
const start = document.querySelector("#start");
const stop = document.querySelector("#stop");
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

/*Start*/
trainMode.addEventListener("click", () => {
    if (trainMode.checked) {
        terminarCiclo.style.visibility = "visible";
        destinoWrapper.style.visibility = "hidden";
    } else {
        terminarCiclo.style.visibility = "hidden";
        destinoWrapper.style.visibility = "visible";
        train.style.animationName = "none";
    }
});

start.addEventListener("click", () => {
    if (trainMode.checked){
        train.style.animationName = "train-animation";

    }else {
        /*Animacion de momdo manual*/
    }
})

/*Stop*/
stop.addEventListener("click", () => {
    train.style.animation = "none";

    const trainPosition = getComputedStyle(train).left;
    train.style.left = trainPosition;
})
