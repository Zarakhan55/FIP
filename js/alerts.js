// alerts.js - visual + sound alerts
class AlertManager {
    constructor() {
        this.alertContainer = document.getElementById("alertList");
        this.audio = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"); // optional
    }

    sendAlert(weapon, confidence, bbox) {
        const time = new Date().toLocaleTimeString();
        const alertDiv = document.createElement("div");
        alertDiv.className = "alert-item";
        alertDiv.innerHTML = `<i class="fas fa-skull-crosswalk"></i> <b>${weapon}</b> detected! Conf: ${(confidence*100).toFixed(1)}% at ${time}<br>
                              <span style="font-size:0.7rem;">📍 BBox: ${Math.round(bbox.x)},${Math.round(bbox.y)} | SMS/Email issued</span>`;
        this.alertContainer.prepend(alertDiv);
        if (CONFIG.alerts.soundEnabled) {
            this.audio.play().catch(e=>console.log("audio blocked"));
        }
        // Simulate SMS/Email
        console.log(`[ALERT] ${weapon} → Security team notified`);
        // Also update total threats counter
        this.updateThreatCounter();
    }

    updateThreatCounter() {
        let current = parseInt(document.getElementById("totalThreats").innerText) || 0;
        document.getElementById("totalThreats").innerText = current + 1;
    }

    clearAlerts() {
        this.alertContainer.innerHTML = '<div class="alert-item" style="background:#1e3a5f;"><i class="fas fa-info-circle"></i> System ready – monitoring active</div>';
    }
}
const alertMgr = new AlertManager();