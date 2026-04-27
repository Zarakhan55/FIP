// ui.js - performance metrics and chart
let perfChart;
let perfData = { acc: [97,98,97,96,98,97], fps: [30,28,31,29,30,32] };

function initChart() {
    const ctx = document.getElementById("perfChart").getContext("2d");
    perfChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1','2','3','4','5','6'],
            datasets: [
                { label: 'Accuracy %', data: perfData.acc, borderColor: '#3b82f6', tension: 0.3 },
                { label: 'FPS', data: perfData.fps, borderColor: '#f97316', tension: 0.3, yAxisID: 'y1' }
            ]
        },
        options: {
            responsive: true,
            scales: { y: { title: { display: true, text: 'Accuracy (%)' } }, y1: { position: 'right', title: { text: 'FPS' } } }
        }
    });
}

function updateMetrics(accuracy, fps, latency) {
    document.getElementById("accuracyValue").innerHTML = accuracy.toFixed(1) + "<span>%</span>";
    document.getElementById("fpsValue").innerHTML = Math.round(fps) + "<span> fps</span>";
    document.getElementById("latencyValue").innerHTML = Math.round(latency) + "<span> ms</span>";
    // update chart sliding
    perfData.acc.push(accuracy);
    perfData.fps.push(fps);
    if(perfData.acc.length > 10) perfData.acc.shift();
    if(perfData.fps.length > 10) perfData.fps.shift();
    perfChart.data.datasets[0].data = perfData.acc;
    perfChart.data.datasets[1].data = perfData.fps;
    perfChart.update('none');
}