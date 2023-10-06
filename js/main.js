"use strict";
// Html elements variables
const buttonStart = document.querySelector("#start");
const buttonStop = document.querySelector("#stop");
const buttonReset = document.querySelector("#reset");
const buttonFinishCycle = document.querySelector(".terminarCiclo");
const checkBoxAutoMan = document.querySelector("#trainMode");
const destinationList = document.querySelector("#destino");
const train = document.querySelector(".train");
const light = document.querySelector(".puertas");
const dialog = document.querySelector(".dialog-busqueda");
const dialogError = document.querySelector(".dialog-error");

// Animation variables
let positions = ["0%", "20%", "40%", "60%", "80%", "100%",];
const cycle = ["0%", "20%", "40%", "60%", "80%", "100%", "80%", "60%", "40%", "20%"];

//PLC variables
let mem_posizioa;
let select_auto_man;
let pm;
let seta;
let rearme;
let pfc;
let busqueda0;
let h1;
let h2;

// Statistics variables
let stopCounts = {
    "20%": 0,
    "40%": 0,
    "60%": 0,
    "80%": 0,
    "100%": 0,
};
let positionTemp;

// ----------Functions start----------

function setButtonsState(startState, stopState, resetState,
                       finishCycleState) {
    const pointerOn = "pointer";
    const pointerOff = "not-allowed";

    buttonStart.disabled = startState;
    startState ? buttonStart.style.cursor = pointerOff : buttonStart.style.cursor = pointerOn;

    buttonStop.disabled = stopState;
    stopState ? buttonStop.style.cursor = pointerOff : buttonStop.style.cursor = pointerOn;

    buttonReset.disabled = resetState;
    resetState ? buttonReset.style.cursor = pointerOff : buttonReset.style.cursor = pointerOn;

    buttonFinishCycle.disabled = finishCycleState;
    finishCycleState ? buttonFinishCycle.style.cursor = pointerOff : buttonFinishCycle.style.cursor = pointerOn;
}

function incrementStopCount(location) {
    if (positionTemp != undefined && location !== positionTemp && mem_posizioa !== 0) {
        stopCounts[location]++;
        localStorage.setItem("stopCounts", JSON.stringify(stopCounts));
        updateStopCountDisplay();
    }
    positionTemp = location;
}

function updateStopCountDisplay() {
    for (const location in stopCounts) {
        const count = stopCounts[location];
        const countElement = document.getElementById(`count-${location}`);
        if (countElement) {
            countElement.textContent = count;
        }
    }
}

/*
function postData(variableName, value) {
    const url = "index.html";
    const data = new URLSearchParams();
    data.append('"mis_datos".'+ variableName.toUpperCase(), value);

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: data
    })
        .then(response => {
            if (response.ok) {
                console.log("Post was successful");
            } else {
                console.error("Failed to update");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}
 */

function postData(...parameters) {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", "index.html", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status > 300) {
                showErrorDialog(`Error al intentar actualizar: ${parameters.toString()}`);
            }
        }
    };

    const data = new URLSearchParams();
    for(let i = 0; i < parameters.length; i++)
        data.append('"mis_datos".' + parameters[i][0].toUpperCase(), parameters[i][1]);
    xhr.send(data);
}


async function getData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "html/output_variables.html", true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            let div = document.createElement("div");
            div.innerHTML = xhr.responseText;

            mem_posizioa = parseInt(div.querySelector("#MEM_POSIZIOA").textContent);
            select_auto_man = returnValueAsBoolean(div.querySelector("#SELEK_AUTO_MAN").textContent);
            seta = returnValueAsBoolean(div.querySelector("#SETA").textContent);
            rearme = returnValueAsBoolean(div.querySelector("#REARME").textContent);
            pfc = returnValueAsBoolean(div.querySelector("#PFC").textContent);
            pm = returnValueAsBoolean(div.querySelector("#PM").textContent);
            busqueda0 = returnValueAsBoolean(div.querySelector("#BUSQUEDA").textContent);
            h1 = returnValueAsBoolean(div.querySelector("#H1").textContent);
            h2 = returnValueAsBoolean(div.querySelector("#H2").textContent);


        }
    };

    xhr.onerror = function () {
        showErrorDialog("Hubo un error al intentar comunicar con el plc.");
    };
    xhr.send();
}

function returnValueAsBoolean(value) {
    value = parseInt(value);
    return value === 1;
}

function playNextAnimation(array, index) {
    train.style.transition = "all 1000ms";
    train.style.left = array[index];
//  turnLightOn();
}

function turnLightOn(isOn) {
    if (isOn) {
        light.classList.remove("changeColor-red");
        light.classList.add("changeColor-green");
    } else {
        light.classList.remove("changeColor-green");
        light.classList.add("changeColor-red");
    }
}

function showErrorDialog(message) {
    let p = document.querySelector(".dialog-error .message");
    p.textContent = message;
    dialogError.showModal();
}

// ----------Functions end----------

window.onload = function () {
    if (localStorage.getItem("stopCounts")) {
        stopCounts = JSON.parse(localStorage.getItem("stopCounts"));
        updateStopCountDisplay();
    }
};

setInterval(() => {
    getData().then(()=> {
        turnLightOn(h1);
        checkBoxAutoMan.checked = select_auto_man;
        incrementStopCount(cycle[mem_posizioa]);

        if (seta) { // State: train is stopped
            setButtonsState(false, true,false, true);
            if (rearme) { // State: train is returning to its origin
                setButtonsState(true, true, true,true);
                train.style.transition = "all 2000ms";
                train.style.left = positions[0];
                postData(["SETA", false], ["REARME", false]);
            }
        } else if (select_auto_man) { // State: train is on automatic mode
            if (pm) { // State: train is running
                setButtonsState(true,false,true, false);
                if (pfc === true && mem_posizioa === 1) {
                    train.style.left = cycle[1];
                    setTimeout(() => {
                        train.style.left = positions[0];
                        postData(["PFC", false], ["PM", false], ["MEM_POSIZIOA", 0]);
                    }, 2000);
                } else {
                    train.style.transition = "all 1000ms";
                    playNextAnimation(cycle, mem_posizioa);
                }
            } else { // State: train is not running
                setButtonsState(false,true,true,true);
                train.style.transition = "all 1000ms";
                train.style.left = cycle[0];
            }
        } else { // State: train is on manual mode
            setButtonsState(false,true,true,true);
            train.style.transition = "all 1000ms";
            playNextAnimation(cycle, mem_posizioa);
            if (pm) {
                postData(["PM", false]);
            }

        }

        if (mem_posizioa === 0 && busqueda0) postData(["BUSQUEDA_0", false]);

    }).catch(error => {showErrorDialog("Fetch error: " + error)})

}, 500);

buttonStart.addEventListener("click", () => {
    if (checkBoxAutoMan.checked) {
        postData(["PM", true], ["SETA", false], ["REARME", false]);
    } else {
        postData(["PM", true], ["SETA", false], ["REARME", false], ["MEM_POSIZIOA", destinationList.selectedIndex]);
    }
});

buttonReset.addEventListener("click", () => {
    if (seta === true) {
        postData(["REARME", true], ["MEM_POSIZIOA", 0]);
    }
});

buttonStop.addEventListener("click", () => {
    postData(["SETA", true], ["PM", false]);
});

buttonFinishCycle.addEventListener("click", () => {
    if (!seta){
        postData(["PFC", true]);
    }
});

checkBoxAutoMan.addEventListener("change", () => {
    if (checkBoxAutoMan.checked) {
        postData(["SELEK_AUTO/MAN", true], ["PM", false], ["MEM_POSIZIOA", 0]);
    } else {
        postData(["SELEK_AUTO/MAN", false], ["PM", false], ["MEM_POSIZIOA", 0]);
    }
});

document.querySelectorAll(".line button").forEach((element, index) => {
    element.addEventListener("click", () => {
        destinationList.selectedIndex = index;
    });
});

// Dialog
document.getElementById("accept").addEventListener("click", () => {
    postData("BUSQUEDA_0", true);
    postData("PM", true);
    dialog.close();
});

document.getElementById("cancel").addEventListener("click", () => {
   dialog.close();
});

document.querySelector(".dialog-error-accept").addEventListener("click", () => {
   dialogError.close();
});