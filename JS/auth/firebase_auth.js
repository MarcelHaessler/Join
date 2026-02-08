/**
 * Firebase configuration and initialization
 * Using Firebase compat version for non-module usage
 */

/** @type {Object} Firebase configuration object */
const firebaseConfig = {
    apiKey: "AIzaSyDSu3EKowLDqtiFCKaMWTVDG_PB-cIA5t0",
    authDomain: "join-ad1a9.firebaseapp.com",
    projectId: "join-ad1a9",
    databaseURL: "https://join-ad1a9-default-rtdb.europe-west1.firebasedatabase.app",
    appId: "1:159410908442:web:d2c57cbf551ca660add0a3"
};

/** @type {firebase.app.App} Initialized Firebase app instance */
const app = firebase.initializeApp(firebaseConfig);

/** @type {firebase.database.Database} Firebase Realtime Database instance */
const db = firebase.database();

/**
 * Logs out the current user and redirects to index page
 * Clears all user-related data from storage
 * @returns {void}
 */
function logoutUser() {
    localStorage.removeItem('join_current_user');
    sessionStorage.removeItem('guestMode');
    sessionStorage.removeItem('showSummaryGreeting');
    window.location.href = "index.html";
}