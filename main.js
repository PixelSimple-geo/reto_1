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
let MEM_POSIZIOA = 0;
let SELEK_AUTO_MAN = false;
let pm = false;

let animationInterval;
let terminateCycle = false;

setInterval(() => {
    getSELECT_AUTO_MAN();
    getMEM_POSIZIOA();
    getPM();
}, 500);

if (SELEK_AUTO_MAN) {
    mode.checked = true;
    if (pm) {
        animationInterval = setInterval(() => {
            getMEM_POSIZIOA();
            if (terminateCycle && MEM_POSIZIOA === 0) {
                clearInterval(animationInterval);
                train.style.left = positions[MEM_POSIZIOA];
                train.style.transition = "all 350ms";
                terminateCycle = false;
            } else {
                train.style.transition = "all 1000ms";
                playNextAnimation(cycle, MEM_POSIZIOA);
            }

        }, 100);
    }
} else {
    mode.checked = false;
}

start.addEventListener("click", () => {
    reset.disabled = true;
    reset.style.cursor = "not-allowed";
    modificarPM(true);
    if (SELEK_AUTO_MAN) {
        mode.disabled = true;
        start.disabled = true;
        start.style.cursor = "not-allowed";
        finishCycle.disabled = false;
        finishCycle.style.cursor = "pointer";

//        train.style.transition = "all 350ms";
//        playNextAnimation(cycle, MEM_POSIZIOA);
        animationInterval = setInterval(() => {
            console.log("inside auto")
            getMEM_POSIZIOA();
            if (terminateCycle && MEM_POSIZIOA === 0) {
                clearInterval(animationInterval);
                train.style.left = positions[MEM_POSIZIOA];
                train.style.transition = "all 350ms";
                terminateCycle = false;
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
    MEM_POSIZIOA = 0;
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
    mode.disabled = false;
});

finishCycle.addEventListener("click", () => {
    terminateCycle = true;
    start.disabled = false;
    start.style.cursor = "pointer";
});


function playNextAnimation(array, index) {
    train.style.left = array[index];
    luz.classList.add("changeColor");

    destino.selectedIndex = positions.indexOf(array[index]);

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
        modificarSELEK_AUTO(true);
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

function resetMEM_POSIZIOA() {
    MEM_POSIZIOA = 0;
    modificarMEM_POSIZIOA();
}

function incrementarMEM_POSIZIOA() {
    MEM_POSIZIOA++;
    modificarMEM_POSIZIOA();
}

function modificarSELEK_AUTO(isAuto) {
    const data = new URLSearchParams();
    data.append('"mis_datos".SELEK_AUTO/MAN', isAuto);

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

function modificarPM(PM) {
    const data = new URLSearchParams();
    data.append('"mis_datos".PM', PM);

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

function getMEM_POSIZIOA() {
    fetch("http://10.0.2.100/awp/pruebas/mem_posizioa.html")
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log("getting mem")
            MEM_POSIZIOA = parseInt(data);
        })
        .catch((error) => {
            console.error('Fetch Error:', error);
        });
}

function getSELECT_AUTO_MAN() {
    fetch("http://10.0.2.100/awp/pruebas/select_auto_man.html")
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            SELEK_AUTO_MAN = data;
        })
        .catch((error) => {
            console.error('Fetch Error:', error);
        });
}



function getPM() {
    fetch("http://10.0.2.100/awp/pruebas/pm.html")
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log("getting pm")
            pm = data;
        })
        .catch((error) => {
            console.error('Fetch Error:', error);
        });
}