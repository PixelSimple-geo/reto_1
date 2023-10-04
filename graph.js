// grafico.js

document.addEventListener("DOMContentLoaded", function() {
    var datosGrafico = JSON.parse(localStorage.getItem("datosGrafico")) ?? [0, 0, 0, 0, 0];

    var grafico = document.getElementById("graph").getContext("2d");

    // Inicializar el gráfico con los datos del localStorage
    var chart = new Chart(grafico, {
        type: "bar",
        data: {
            labels: ["Ibaiondo", "Wellington", "Txagorritxu", "Europa", "Lovaina"],
            datasets: [
                {
                    label: "Vaces que se han hecho paradas",
                    backgroundColor: "#48ff00",
                    borderColor: "#70ffb4",
                    data: datosGrafico,
                }
            ]
        }
    });

    window.addEventListener("storage", () => {
        datosGrafico = JSON.parse(localStorage.getItem("datosGrafico")) ?? [0, 0, 0, 0, 0];
        chart.data.datasets[0].data = datosGrafico;
        chart.update();
    });
});
