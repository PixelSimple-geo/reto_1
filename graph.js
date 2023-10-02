/*Datos del grafico*/
// Datos de ejemplo para el gráfico
var datosGrafico = {
    data: [22, 20, 6, 36, 12]
};

// Convertir el objeto a cadena JSON
var datosGraficoJSON = JSON.stringify(datosGrafico);

// Guardar los datos en el localStorage
localStorage.setItem("datosGrafico", datosGraficoJSON);

console.log("Datos del gráfico guardados en el localStorage.");


// Obtener los datos del localStorage
var datosGuardados = localStorage.getItem("datosGrafico");

// Verificar si hay datos en el localStorage
if (datosGuardados) {
    // Convertir los datos de cadena JSON a un objeto JavaScript
    var datos = JSON.parse(datosGuardados);

    // Obtener el contexto del gráfico
    var grafico = document.getElementById("graph").getContext("2d");

    // Crear el gráfico usando los datos del localStorage
    var chart = new Chart(grafico, {
        type: "line",
        data: {
            labels: ["Ibaiondo", "Wellington", "Txagorritxu", "Europa", "Lovaina"],
            datasets: [
                {
                    label: "Vaces que se han hecho paradas",
                    backgroundColor: "#48ff00",
                    borderColor: "#70ffb4",
                    data: datos.data,
                }
            ]
        }
    });
} else {
    console.log("No hay datos en el localStorage para el gráfico.");
}

