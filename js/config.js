// Global configuration
const CONFIG = {
    detection: {
        confidenceThreshold: 0.75,
        fpsInterval: 100,      // ms between detection frames
        mockMode: true,        // set false when integrating real YOLO API
        apiEndpoint: "https://your-yolo-api.com/detect", // replace
    },
    alerts: {
        soundEnabled: true,
        emailAlerts: false,     // enable if backend configured
        smsGateway: "",
    },
    evidence: {
        dbName: "WeaponDetectDB",
        storeName: "evidence",
        maxRecords: 200,
    },
    video: {
        deviceId: null, // default webcam
        width: 640,
        height: 480,
    }
};