const trainMode = document.querySelector("#trainMode");
const destinoWrapper = document.querySelector(".destino-wrapper");
const terminarCiclo = document.querySelector(".terminarCiclo");

trainMode.addEventListener("click", () => {
   if (trainMode.checked) {
       terminarCiclo.style.display = "block";
       destinoWrapper.style.display = "none";
   } else {
       terminarCiclo.style.display = "none";
       destinoWrapper.style.display = "block";
   }
});
