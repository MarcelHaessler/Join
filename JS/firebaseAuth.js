import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDSu3EKowLDqtiFCKaMWTVDG_PB-cIA5t0",
    authDomain: "join-ad1a9.firebaseapp.com",
    projectId: "join-ad1a9",
    databaseURL: "https://join-ad1a9-default-rtdb.europe-west1.firebasedatabase.app",
    appId: "1:159410908442:web:d2c57cbf551ca660add0a3"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

function logoutUser() {
    localStorage.removeItem('join_current_user');
    sessionStorage.removeItem('guestMode');
    sessionStorage.removeItem('showSummaryGreeting');
    window.location.href = "index.html";
}

window.logoutUser = logoutUser;