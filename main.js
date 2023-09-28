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
       terminarCiclo.style.display = "block";
       destinoWrapper.style.display = "none";

   } else {
       terminarCiclo.style.display = "none";
       destinoWrapper.style.display = "block";
       train.style.animationName = "none";
   }
});

start.addEventListener("click", () => {
    train.style.animationName = "train-animation";
})

/*Stop*/
function stopTrain() {
    train.style.animation = "none";

    const trainPosition = getComputedStyle(train).left;
    train.style.left = trainPosition;
}

stop.addEventListener("click", stopTrain);
