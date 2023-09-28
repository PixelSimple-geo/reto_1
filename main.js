const url = "url a nuestro plc";

const startButton = document.getElementById("start");
let isOn = false;

startButton.addEventListener("click", () => {
    fetch(url)
        .then(response => {
            if (response.ok)
                return response.json()
            else
                throw new Error("No se ha podido hacer fetch["+url+"].")
        })
        .then(data => {
            isOn = data;
        })
        .catch(error => {
            console.error("fetch error["+url+"]: " + error)
        });
});
