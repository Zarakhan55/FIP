// evidence.js - save detections, export CSV
class EvidenceManager {
    constructor() {
        this.db = null;
        this.initDB();
    }

    initDB() {
        const request = indexedDB.open(CONFIG.evidence.dbName, 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(CONFIG.evidence.storeName)) {
                db.createObjectStore(CONFIG.evidence.storeName, { keyPath: "id", autoIncrement: true });
            }
        };
        request.onsuccess = (e) => { this.db = e.target.result; };
    }

    async addEvidence(weapon, confidence, bbox) {
        if (!this.db) return;
        const tx = this.db.transaction(CONFIG.evidence.storeName, "readwrite");
        const store = tx.objectStore(CONFIG.evidence.storeName);
        const record = {
            timestamp: new Date().toISOString(),
            weapon,
            confidence: confidence.toFixed(2),
            bbox: JSON.stringify(bbox),
            savedAt: Date.now()
        };
        store.add(record);
        // Also update UI table
        this.refreshTableUI();
    }

    async getAllEvidence() {
        return new Promise((resolve) => {
            if (!this.db) return resolve([]);
            const tx = this.db.transaction(CONFIG.evidence.storeName, "readonly");
            const store = tx.objectStore(CONFIG.evidence.storeName);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
        });
    }

    async refreshTableUI() {
        const items = await this.getAllEvidence();
        const tbody = document.getElementById("evidenceBody");
        if (items.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No evidence yet</td></tr>';
            return;
        }
        tbody.innerHTML = items.slice().reverse().slice(0, 20).map(item => `
            <tr>
                <td>${new Date(item.timestamp).toLocaleString()}</td>
                <td><strong style="color:#ff8888">${item.weapon}</strong></td>
                <td>${(item.confidence * 100).toFixed(1)}%</td>
                <td>${item.bbox}</td>
                <td><i class="fas fa-save"></i> saved</td>
            </tr>
        `).join("");
    }

    async exportCSV() {
        const items = await this.getAllEvidence();
        let csv = "Timestamp,Weapon,Confidence,BBox\n";
        items.forEach(i => {
            csv += `${i.timestamp},${i.weapon},${i.confidence},${i.bbox}\n`;
        });
        const blob = new Blob([csv], { type: "text/csv" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `weapon_logs_${Date.now()}.csv`;
        a.click();
    }
}
const evidenceDB = new EvidenceManager();