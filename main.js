const url = "url a nuestro plc";

const start = document.getElementById("start");
let isOn = false;
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