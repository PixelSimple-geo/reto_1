document.addEventListener("DOMContentLoaded", function() {
    var grafico = document.getElementById("graph").getContext("2d");
    const positions = ["20%", "40%", "60%", "80%", "100%"];
    const labels = ["P1", "P2", "P3", "P4", "P5"];

    function updateChart() {
        var data = [0, 0, 0, 0, 0];

        // Retrieve the stopCounts data from localStorage
        var stopCounts = JSON.parse(localStorage.getItem("stopCounts")) || {};

        for (var i = 0; i < data.length; i++) {
            var location = positions[i];
            data[i] = stopCounts[location] || 0;
        }

        // Create or update the chart
        var chart = new Chart(grafico, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Paradas",
                        backgroundColor: "#ffc312",
                        borderColor: "#EE5A24",
                        data: data,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }

    updateChart();

    window.addEventListener("storage", function() {
        updateChart();
    });
});
