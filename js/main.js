"use strict";
// Html elements variables
const buttonStart = document.querySelector("#start");
const buttonStop = document.querySelector("#stop");
const buttonReset = document.querySelector("#reset");
const buttonFinishCycle = document.querySelector(".terminarCiclo");
const checkBoxAutoMan = document.querySelector("#trainMode");
const destinationList = document.querySelector("#destino");
const train = document.querySelector("#train");
const light = document.querySelector(".puertas");
const dialogError = document.querySelector(".dialog-error");

// Animation variables
const cycle = ["0%", "20%", "40%", "60%", "80%", "100%", "80%", "60%", "40%", "20%"];

//PLC variables
const URI = "html/IO_variables.html";
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
let stopCounts = {"20%": 0, "40%": 0, "60%": 0, "80%": 0, "100%": 0};
let positionTemp;

async function getData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", URI);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const div = document.createElement("div");
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
    xhr.onerror = () => showErrorDialog("Hubo un error al intentar comunicar con el plc.");
    xhr.send();
}

const returnValueAsBoolean = (value) => parseInt(value) === 1;

function postData(...parameters) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", URI, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE)
            if (xhr.status > 300) showErrorDialog(`Error al intentar actualizar: ${parameters.toString()}`);
    };
    const data = new URLSearchParams();
    for(let i = 0; i < parameters.length; i++)
        data.append('"mis_datos".' + parameters[i][0].toUpperCase(), parameters[i][1]);
    xhr.send(data);
}

function setButtonsState(buttonStartState, buttonStopState, buttonResetState, buttonFinishCycleState) {
    const cursorOn = "pointer";
    const cursorOff = "not-allowed";

    buttonStart.disabled = buttonStartState;
    buttonStartState ? buttonStart.style.cursor = cursorOff : buttonStart.style.cursor = cursorOn;

    buttonStop.disabled = buttonStopState;
    buttonStopState ? buttonStop.style.cursor = cursorOff : buttonStop.style.cursor = cursorOn;

    buttonReset.disabled = buttonResetState;
    buttonResetState ? buttonReset.style.cursor = cursorOff : buttonReset.style.cursor = cursorOn;

    buttonFinishCycle.disabled = buttonFinishCycleState;
    buttonFinishCycleState ? buttonFinishCycle.style.cursor = cursorOff : buttonFinishCycle.style.cursor = cursorOn;
}

function playNextAnimation(value) {
    train.style.transition = "all 1000ms";
    train.style.left = value;
    train.classList.add("train-animation")
    setTimeout(() => train.classList.remove("train-animation"), 1000);
}

function turnLightOn(h1, h2) {
    if (h1) {
        light.classList.remove("changeColor-red");
        light.classList.add("changeColor-green");
    } else if (h2) {
        light.classList.remove("changeColor-green");
        light.classList.add("changeColor-red");
    }  else {
        light.classList.remove("changeColor-green");
        light.classList.remove("changeColor-red");
        light.classList.add("no-light");
    }
}

function showErrorDialog(message) {
    document.querySelector(".dialog-error .message").textContent = message;
    dialogError.showModal();
}

function incrementStopCount(location) {
    if (positionTemp !== undefined && location !== positionTemp && mem_posizioa !== 0) {
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
        if (countElement) countElement.textContent = count;
    }
}

window.onload = function () {
    if (localStorage.getItem("stopCounts")) {
        stopCounts = JSON.parse(localStorage.getItem("stopCounts"));
        updateStopCountDisplay();
    }
};

setInterval(() => {
    getData().then(()=> {
        turnLightOn(h1, h2);
        checkBoxAutoMan.checked = select_auto_man;
        incrementStopCount(cycle[mem_posizioa]);
        playNextAnimation(cycle[mem_posizioa]);
        if (seta) {
            setButtonsState(false, true,false, true);
            if (rearme && mem_posizioa === 0) {
                setButtonsState(true, true,true, true);
                postData(["SETA", false], ["REARME", false]);
            }
        } else if (select_auto_man) {
            setButtonsState(false, false,true, false);
            if (pfc && mem_posizioa === 1)
                setTimeout(() => {
                    postData(["PFC", false], ["PM", false], ["MEM_POSIZIOA", 0]);
                    playNextAnimation(cycle[mem_posizioa]);
                }, 1000)
        } else setButtonsState(false, true,true, true);
        if (mem_posizioa === 0 && busqueda0) postData(["BUSQUEDA_0", false]);
    }).catch(error => {showErrorDialog("Fetch error: " + error)})
}, 500);

buttonStart.addEventListener("click", () => {
    checkBoxAutoMan.checked ? postData(["PM", true], ["SETA", false], ["REARME", false])
        : postData(["PM", true], ["SETA", false], ["REARME", false], ["MEM_POSIZIOA", destinationList.selectedIndex]);
});

buttonStop.addEventListener("click", () => {
    postData(["SETA", true], ["PM", false]);
});

buttonReset.addEventListener("click", () => {
    postData(["REARME", true], ["MEM_POSIZIOA", 0]);
});

buttonFinishCycle.addEventListener("click", () => {
    postData(["PFC", true]);
});

checkBoxAutoMan.addEventListener("change", () => {
    checkBoxAutoMan.checked ? postData(["SELEK_AUTO/MAN", true], ["PM", false], ["MEM_POSIZIOA", 0])
        : postData(["SELEK_AUTO/MAN", false], ["PM", false], ["MEM_POSIZIOA", 0]);
});

document.querySelectorAll(".line button").forEach((element, index) => {
    element.addEventListener("click", () => destinationList.selectedIndex = index);
});

document.querySelector(".dialog-error-accept").addEventListener("click", () => {
   dialogError.close();
});