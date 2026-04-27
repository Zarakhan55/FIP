// app.js - orchestrates webcam, detection loop, UI
const video = document.getElementById("webcam");
const overlayCanvas = document.getElementById("overlayCanvas");
const ctxOverlay = overlayCanvas.getContext("2d");
let detectionEngine = new DetectionEngine();
let animationId = null;

async function initWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        await new Promise(r => video.onloadedmetadata = r);
        overlayCanvas.width = video.videoWidth;
        overlayCanvas.height = video.videoHeight;
        startDetectionPipeline();
    } catch(err) {
        console.error("Camera error:", err);
        alert("Camera access required for real surveillance.");
    }
}

function startDetectionPipeline() {
    // Start mock weapon detection
    detectionEngine.startMockDetection((weapon, confidence, bbox) => {
        alertMgr.sendAlert(weapon, confidence, bbox);
        evidenceDB.addEvidence(weapon, confidence, bbox);
        drawBoundingBox(weapon, bbox, confidence);
        // Simulate performance variation
        let newAcc = 96 + Math.random() * 2.5;
        let newFps = 27 + Math.random() * 8;
        let newLat = 40 + Math.random() * 20;
        updateMetrics(newAcc, newFps, newLat);
    });

    // Drawing loop (overlay on camera)
    function drawLoop() {
        if (!video.videoWidth) return;
        ctxOverlay.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        // additional realtime bounding boxes drawn inside detection callback
        requestAnimationFrame(drawLoop);
    }
    drawLoop();
}

function drawBoundingBox(type, bbox, conf) {
    ctxOverlay.strokeStyle = type === "GUN" ? "#ff3366" : "#ffaa44";
    ctxOverlay.lineWidth = 3;
    ctxOverlay.fillStyle = type === "GUN" ? "rgba(255,50,80,0.2)" : "rgba(255,170,68,0.2)";
    ctxOverlay.fillRect(bbox.x, bbox.y, bbox.w, bbox.h);
    ctxOverlay.strokeRect(bbox.x, bbox.y, bbox.w, bbox.h);
    ctxOverlay.font = "bold 16px 'Segoe UI'";
    ctxOverlay.fillStyle = "#fff";
    ctxOverlay.shadowBlur = 0;
    ctxOverlay.fillText(`${type} ${(conf*100).toFixed(0)}%`, bbox.x, bbox.y-6);
    // remove after 1 sec to simulate refresh
    setTimeout(() => {
        ctxOverlay.clearRect(bbox.x-5, bbox.y-30, bbox.w+50, bbox.h+40);
    }, 900);
}

// Event Listeners
document.getElementById("testAlarmBtn").addEventListener("click", () => {
    const testWeapon = Math.random() > 0.5 ? "GUN" : "KNIFE";
    alertMgr.sendAlert(testWeapon, 0.92, { x: 200, y: 150, w: 70, h: 50 });
    evidenceDB.addEvidence(testWeapon, 0.92, { x: 200, y: 150, w: 70, h: 50 });
});
document.getElementById("clearAlertsBtn").addEventListener("click", () => alertMgr.clearAlerts());
document.getElementById("exportLogsBtn").addEventListener("click", () => evidenceDB.exportCSV());

// Initialize
initChart();
initWebcam();
evidenceDB.refreshTableUI();