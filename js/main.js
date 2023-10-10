"use strict";
/* Variables para elementos HTML */
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

/* Variables para animación */
const cycle = ["0%", "20%", "40%", "60%", "80%", "100%", "80%", "60%", "40%", "20%"];

/* Variables para PLC */
const URI = "html/IO_variables.html";
let mem_posizioa, select_auto_man, pm, seta, rearme, pfc, busqueda0, h1, h2,
    mem_posizioaTemp = -Infinity; // No es una variable PLC, se utiliza para el seguimiento de estado

/* Variables para estadísticas */
let stopCounts = {"20%": 0, "40%": 0, "60%": 0, "80%": 0, "100%": 0};

/**
 * Obtiene datos del servidor.
 * @returns {Promise<void>}
 */
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

/**
 * Convierte un valor en un booleano.
 * @param {string} value - El valor a convertir.
 * @returns {boolean} El valor convertido.
 */
const returnValueAsBoolean = (value) => parseInt(value) === 1;

/**
 * Envía datos al servidor.
 * @param {...Array} parameters - Los parámetros para enviar al servidor.
 */
function postData(...parameters) {
    fetch(URI, {
        method: 'POST',
        body: parameters.map(element => `"mis_datos".${element[0].toUpperCase()}=${element[1]}`).join("\n")
    }).then(response => {
        if (!response.ok) showErrorDialog(`Error al intentar actualizar: ${parameters.toString()}`);
    }).catch(error => showErrorDialog('Error en el fetch: ' + error));
}

/**
 * Establece el estado de un botón.
 * @param {Element} button - El botón al que se le establecerá el estado.
 * @param {boolean} isDisabled - Indica si el botón estará deshabilitado o no.
 */
function setButtonState(button, isDisabled) {
    button.disabled = isDisabled;
    button.style.cursor = isDisabled ? "not-allowed" : "pointer";
}

/**
 * Establece el estado de varios botones.
 * @param {boolean} buttonStartState - Estado del botón de inicio.
 * @param {boolean} buttonStopState - Estado del botón de parada.
 * @param {boolean} buttonResetState - Estado del botón de reinicio.
 * @param {boolean} buttonFinishCycleState - Estado del botón de finalización de ciclo.
 * @param {boolean} [buttonFindOriginState] - Estado opcional del botón de búsqueda de origen.
 */
function setButtonsState(buttonStartState, buttonStopState, buttonResetState, buttonFinishCycleState, buttonFindOriginState = busqueda0) {
    setButtonState(buttonStart, buttonStartState);
    setButtonState(buttonStop, buttonStopState);
    setButtonState(buttonReset, buttonResetState);
    setButtonState(buttonFinishCycle, buttonFinishCycleState);
    setButtonState(buttonFindOrigin, buttonFindOriginState);
}

/**
 * Reproduce la siguiente animación del tren.
 */
function playNextAnimation() {
    if (hasTrainMoved(mem_posizioa, mem_posizioaTemp)) {
        train.style.left = cycle[mem_posizioa];
        train.classList.remove("train-animation-stopped");
        train.classList.add("train-animation-moving")
    } else if (!hasTrainMoved(mem_posizioa, mem_posizioaTemp)) {
        train.classList.remove("train-animation-moving");
        train.classList.add("train-animation-stopped")
    }
}

/**
 * Enciende o apaga la luz.
 */
function turnLightOn() {
    light.classList.remove("changeColor-red", "changeColor-green");
    if (h1) light.classList.add("changeColor-green"); else if (h2) light.classList.add("changeColor-red");
}

/**
 * Muestra un cuadro de diálogo de error.
 * @param {string} message - El mensaje de error a mostrar.
 */
function showErrorDialog(message) {
    document.querySelector(".dialog-error .message").textContent = message;
    dialogError.showModal();
}

/**
 * Comprueba si el tren se ha movido.
 * @param {number} posicion - La posición actual del tren.
 * @param {number} valorTemporal - El valor temporal anterior del tren.
 * @returns {boolean} `true` si el tren se ha movido; de lo contrario, `false`.
 */
const hasTrainMoved = (posicion, valorTemporal) => posicion !== valorTemporal;

/**
 * Incrementa el contador de paradas si el tren se ha movido y no está en la posición 0.
 */
function incrementStopCount() {
    if (hasTrainMoved(mem_posizioa, mem_posizioaTemp) && mem_posizioa !== 0) {
        stopCounts[cycle[mem_posizioa]]++;
        localStorage.setItem("stopCounts", JSON.stringify(stopCounts));
        updateStopCountDisplay();
    }
}

/**
 * Actualiza la pantalla de visualización del contador de paradas.
 */
function updateStopCountDisplay() {
    for (const location in stopCounts) {
        const count = stopCounts[location];
        const countElement = document.getElementById(`count-${location}`);
        if (countElement) countElement.textContent = count;
    }
}

/**
 * Función que se ejecuta cuando la página se ha cargado completamente.
 */
window.onload = () => {
    if (localStorage.getItem("stopCounts")) {
        stopCounts = JSON.parse(localStorage.getItem("stopCounts"));
        updateStopCountDisplay();
    }
};

/**
 * Maneja el clic en el botón de inicio.
 * @function
 */
buttonStart.addEventListener("click", () => {
    if (checkBoxAutoMan.checked) postData(["PM", true], ["SETA", false], ["REARME", false]);
    else postData(["PM", true], ["SETA", false], ["REARME", false], ["MEM_POSIZIOA", destinationList.selectedIndex]);
});

/**
 * Maneja el clic en el botón de parada.
 * @function
 */
buttonStop.addEventListener("click", () => {
    postData(["SETA", true], ["PM", false]);
});

/**
 * Maneja el clic en el botón de reinicio.
 * @function
 */
buttonReset.addEventListener("click", () => {
    postData(["REARME", true], ["MEM_POSIZIOA", 0]);
});

/**
 * Maneja el clic en el botón de finalización de ciclo.
 * @function
 */
buttonFinishCycle.addEventListener("click", () => {
    postData(["PFC", true]);
});

/**
 * Maneja el clic en el botón de búsqueda de origen.
 * @function
 */
buttonFindOrigin.addEventListener("click", () => {
    postData(["BUSQUEDA_0", true]);
});

/**
 * Maneja el cambio en la casilla de verificación Auto/Manual.
 * @function
 */
checkBoxAutoMan.addEventListener("change", () => {
    checkBoxAutoMan.disabled = true;
    if (checkBoxAutoMan.checked) postData(["SELEK_AUTO/MAN", true], ["PM", false], ["MEM_POSIZIOA", 0]);
    else postData(["SELEK_AUTO/MAN", false], ["PM", false], ["MEM_POSIZIOA", 0]);
});

/**
 * Maneja el clic en los botones dentro de .train-wrapper.
 * @function
 * @param {Element} element - El elemento de botón clicado.
 * @param {number} index - El índice del elemento clicado.
 */
document.querySelectorAll(".train-wrapper button").forEach((element, index) => {
    element.addEventListener("click", () => destinationList.selectedIndex = index);
});

/**
 * Maneja el clic en el botón de aceptar en el cuadro de diálogo de error.
 * @function
 */
document.querySelector(".dialog-error-accept").addEventListener("click", () => {
    dialogError.close();
});

/**
 * Función que se ejecuta periódicamente para actualizar la interfaz.
 * @function
 */
setInterval(() => {
    getData().then(() => {
        turnLightOn();
        setTimeout(() => {
            checkBoxAutoMan.checked = select_auto_man;
            checkBoxAutoMan.disabled = false;
        }, 500);
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
            if (pfc && mem_posizioa === 1) {
                postData(["PFC", false], ["PM", false], ["MEM_POSIZIOA", 0]);
            }
        } else {
            setButtonsState(false, true, true, true);
        }
        mem_posizioaTemp = mem_posizioa;
    }).catch(error => {
        showErrorDialog("Fetch error: " + error);
    });
}, 1000);