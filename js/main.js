"use strict";
// Html elements variables
const buttonStart = document.querySelector("#start");
const buttonStop = document.querySelector("#stop");
const buttonReset = document.querySelector("#reset");
const buttonFinishCycle = document.querySelector(".terminarCiclo");
const buttonFindOrigin = document.querySelector(".reencontrarse");
const checkBoxAutoMan = document.querySelector("#trainMode");
const destinationList = document.querySelector("#destino");
const train = document.querySelector(".train");
const light = document.querySelector(".puertas");
const dialogError = document.querySelector(".dialog-error");

// Animation variables
const cycle = ["0%", "20%", "40%", "60%", "80%", "100%", "80%", "60%", "40%", "20%"];

//PLC variables
const URI = "html/IO_variables.html";
let mem_posizioa, select_auto_man, pm, seta, rearme, pfc, busqueda0, h1, h2,
    mem_posizioaTemp = -Infinity; // Not a PLC variable. It's for state tracking purposes

// Statistics variables
let stopCounts = {"20%": 0, "40%": 0, "60%": 0, "80%": 0, "100%": 0};

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

function setButtonState(button, isDisabled) {
    button.disabled = isDisabled;
    button.style.cursor = isDisabled ? "not-allowed" : "pointer";
}

function setButtonsState(buttonStartState, buttonStopState, buttonResetState, buttonFinishCycleState, buttonFindOriginState = busqueda0) {
    setButtonState(buttonStart, buttonStartState);
    setButtonState(buttonStop, buttonStopState);
    setButtonState(buttonReset, buttonResetState);
    setButtonState(buttonFinishCycle, buttonFinishCycleState);
    setButtonState(buttonFindOrigin, buttonFindOriginState);
}

function playNextAnimation() {
    train.style.transition = "all 1000ms";
    train.style.left = cycle[mem_posizioa];
    train.classList.remove("train-animation-stopped", "train-animation-moving");
    hasTrainMoved() ? train.classList.add("train-animation-moving") : train.classList.add("train-animation-stopped");
}

function turnLightOn() {
    light.classList.remove("changeColor-red", "changeColor-green");
    if (h1) light.classList.add("changeColor-green"); else if (h2) light.classList.add("changeColor-red");
}

function showErrorDialog(message) {
    document.querySelector(".dialog-error .message").textContent = message;
    dialogError.showModal();
}

const hasTrainMoved = () => mem_posizioa !== mem_posizioaTemp;

function incrementStopCount() {
    if (hasTrainMoved() && mem_posizioa !== 0) {
        stopCounts[cycle[mem_posizioa]]++;
        localStorage.setItem("stopCounts", JSON.stringify(stopCounts));
        updateStopCountDisplay();
    }
}

function updateStopCountDisplay() {
    for (const location in stopCounts) {
        const count = stopCounts[location];
        const countElement = document.getElementById(`count-${location}`);
        if (countElement) countElement.textContent = count;
    }
}

window.onload = () => {
    if (localStorage.getItem("stopCounts")) {
        stopCounts = JSON.parse(localStorage.getItem("stopCounts"));
        updateStopCountDisplay();
    }
};

buttonStart.addEventListener("click", () =>
    checkBoxAutoMan.checked ? postData(["PM", true], ["SETA", false], ["REARME", false])
        : postData(["PM", true], ["SETA", false], ["REARME", false], ["MEM_POSIZIOA", destinationList.selectedIndex]));
buttonStop.addEventListener("click", () => postData(["SETA", true], ["PM", false]));
buttonReset.addEventListener("click", () => postData(["REARME", true], ["MEM_POSIZIOA", 0]));
buttonFinishCycle.addEventListener("click", () => postData(["PFC", true]));
buttonFindOrigin.addEventListener("click", () => postData(["BUSQUEDA_0", true]));
checkBoxAutoMan.addEventListener("change", () => {
    checkBoxAutoMan.disabled = true;
    checkBoxAutoMan.checked ? postData(["SELEK_AUTO/MAN", true], ["PM", false], ["MEM_POSIZIOA", 0])
        : postData(["SELEK_AUTO/MAN", false], ["PM", false], ["MEM_POSIZIOA", 0])
});
document.querySelectorAll(".train-wrapper button").forEach((element, index) =>
    element.addEventListener("click", () => destinationList.selectedIndex = index));
document.querySelector(".dialog-error-accept").addEventListener("click", () => dialogError.close());

setInterval(() => {
    getData().then(()=> {
        turnLightOn();
        setTimeout(() => {checkBoxAutoMan.checked = select_auto_man; checkBoxAutoMan.disabled = false}, 500);
        incrementStopCount();
        playNextAnimation();
        if (seta) {
            setButtonsState(false, true, false, true);
            if (rearme && mem_posizioa === 0) {
                setButtonsState(true, true, true, true);
                postData(["SETA", false], ["REARME", false]);
            }
        } else if (select_auto_man) {
            setButtonsState(false, false, true, false);
            if (pfc && mem_posizioa === 1)
                postData(["PFC", false], ["PM", false], ["MEM_POSIZIOA", 0]);
        } else setButtonsState(false, true, true, true);
        mem_posizioaTemp = mem_posizioa;
    }).catch(error => showErrorDialog("Fetch error: " + error))}, 1000);