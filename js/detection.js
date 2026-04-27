// detection.js - simulates YOLO inference (replace with real model)
class DetectionEngine {
    constructor() {
        this.lastTimestamp = 0;
        this.mockInterval = null;
    }

    // Start mock detection loop (every ~1.5 sec random weapon)
    startMockDetection(onDetect) {
        if (this.mockInterval) clearInterval(this.mockInterval);
        this.mockInterval = setInterval(() => {
            // Random weapon appearance (realistic real-world pattern)
            const rand = Math.random();
            if (rand < 0.28) { // 28% chance per interval
                const isGun = Math.random() > 0.4;
                const weapon = isGun ? "GUN" : "KNIFE";
                const confidence = 0.82 + Math.random() * 0.15;
                const bbox = {
                    x: 100 + Math.random() * 400,
                    y: 80 + Math.random() * 250,
                    w: 50 + Math.random() * 60,
                    h: 40 + Math.random() * 80
                };
                onDetect(weapon, confidence, bbox);
            }
        }, 1800);
    }

    stopMockDetection() {
        if (this.mockInterval) clearInterval(this.mockInterval);
    }

    // Real integration placeholder: call API or TF.js
    async detectFromFrame(imageData) {
        if (!CONFIG.detection.mockMode) {
            // Example: send to backend
            // const res = await fetch(CONFIG.detection.apiEndpoint, {...})
            // return res.json();
        }
        return [];
    }
}