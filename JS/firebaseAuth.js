import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDSu3EKowLDqtiFCKaMWTVDG_PB-cIA5t0",
    authDomain: "join-ad1a9.firebaseapp.com",
    projectId: "join-ad1a9",
    databaseURL: "https://join-ad1a9-default-rtdb.europe-west1.firebasedatabase.app",
    appId: "1:159410908442:web:d2c57cbf551ca660add0a3"
};

// 1. App initialisieren
const app = initializeApp(firebaseConfig);

// 2. Services exportieren (damit andere Dateien sie nutzen können)
export const auth = getAuth(app);
export const db = getDatabase(app);

// 3. Globaler Auth Listener (optional, aber praktisch für alle Seiten)
// Feuert ein Event, sobald Firebase weiß, wer eingeloggt ist
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Wir erstellen ein eigenes Event, auf das initials.js hören kann
        const event = new CustomEvent("userReady", {
            detail: { name: user.displayName, email: user.email }
        });
        window.dispatchEvent(event);
    } else {
        // Optional: Schutz für interne Seiten (wirft User raus, wenn nicht eingeloggt)
        // if (!window.location.pathname.includes("index.html") && !window.location.pathname.includes("registration.html")) {
        //    window.location.href = "index.html";
        // }
    }
});

// 4. Globale Logout Funktion
async function logoutUser() {
    try {
        await signOut(auth);
        console.log("Logout erfolgreich");
        window.location.href = "index.html";
    } catch (error) {
        console.error("Fehler beim Logout:", error);
    }
}

// WICHTIG: Funktion global verfügbar machen, damit HTML onclick="logoutUser()" sie findet
window.logoutUser = logoutUser;