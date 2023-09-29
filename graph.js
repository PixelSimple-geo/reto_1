/*Grafico*/
var grafico = document.getElementById("graph").getContext("2d");
var chart = new Chart(grafico, {
    type: "line",
    data: {
        labels: ["Ibaiondo", "Wellington", "Txagorritxu", "Europa", "Lovaina"],
        datasets: [
            {
                label: "Vaces que se han hecho paradas",
                backgroundColor: "#48ff00",
                borderColor: "#70ffb4",
                data: [132, 244, 78, 24, 231],
            }
        ]
    },
});
