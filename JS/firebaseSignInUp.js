// Importiere die zentralen Instanzen aus deiner firebase.js
import { auth, db } from "./firebaseAuth.js";

// Importiere Auth-Funktionen
import { 
    signInWithEmailAndPassword,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";

// Importiere Datenbank-Funktionen
import { 
    ref, 
    push, 
    set 
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";

// DOM Elemente
const name = document.getElementById("signup-name");
const email = document.getElementById("signup-email");
const pw = document.getElementById("signup-password");
const pwRepeat = document.getElementById("signup-password-repeat");
const accept = document.getElementById("accept-policy");
const pwError = document.querySelector(".false_password");

// Login Status Variable
let manualLogin = false;

// --------------------------------------------------------
// LOGIN FUNKTION
// --------------------------------------------------------
function loginUser() {
    const emailInput = document.getElementById("login-mail");
    const passwordInput = document.getElementById("login-password");
    const errorMsg = document.querySelector(".false_password");

    if (errorMsg) errorMsg.style.display = "none";

    signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
        .then((userCredential) => {
            console.log("Login erfolgreich:", userCredential.user.email);
            manualLogin = true; // Markiere manuellen Login für Weiterleitung
            window.location.href = "summary.html";
        })
        .catch((error) => {
            console.error("Login Fehler:", error);
            manualLogin = false; 
            if (errorMsg) errorMsg.style.display = "block";
        });
}

// --------------------------------------------------------
// AUTH STATE LISTENER (Überwacht Login-Status)
// --------------------------------------------------------
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Event feuern, damit andere Scripte wissen, dass User da ist
        const event = new CustomEvent("userReady", {
            detail: { name: user.displayName, email: user.email }
        });
        window.dispatchEvent(event);
        
        // Icon im Header aktualisieren (falls vorhanden)
        const icon = document.getElementById("personIcon");
        if (icon) {
            icon.textContent = getFirstAndLastInitial(user.displayName || "NN");
        }

        // Falls wir auf der Login-Seite (index.html) sind und eingeloggt wurden:
        if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
            // Optional: Automatische Weiterleitung wenn session noch aktiv ist
            // window.location.href = "summary.html"; 
        }

    } else {
        console.log("Kein User eingeloggt");
    }
});

// --------------------------------------------------------
// LOGOUT FUNKTION
// --------------------------------------------------------
function logoutUser() {
    signOut(auth)
        .then(() => {
            console.log("Logout erfolgreich!"); 
            window.location.href = "index.html";           
        })
        .catch((error) => {
            console.error("Logout fehlgeschlagen:", error);
        });
}

// --------------------------------------------------------
// REGISTRIERUNG (SIGN UP)
// --------------------------------------------------------
export async function registerUser() {
    const isInputValid = confirmInput();
    
    if (isInputValid) {
        try {
            // 1. User im Auth System anlegen
            const userCredential = await createUserWithEmailAndPassword(auth, email.value, pw.value);
            const user = userCredential.user;
            console.log("User erstellt:", user.uid);

            // 2. Profilnamen setzen
            await updateProfile(user, {
                displayName: name.value
            });

            // 3. User in die Realtime Database schreiben (nutzt jetzt SDK statt fetch!)
            const newUserRef = push(ref(db, "users"));
            await set(newUserRef, { 
                name: name.value, 
                email: email.value 
            });

            // 4. Weiterleitung zum Login
            window.location.href = "index.html";

        } catch (error) {
            console.error("Registrierungsfehler:", error);
            if (error.code === "auth/email-already-in-use") {
                alert("Diese Email wird bereits verwendet.");
                email.classList.add('invalid');
            } else {
                alert("Ein Fehler ist aufgetreten: " + error.message);
            }
        }
    }
}

// --------------------------------------------------------
// HILFSFUNKTIONEN (Validierung & Formatierung)
// --------------------------------------------------------
function confirmInput() {
    // Regex Muster (sollten idealerweise global oder importiert sein)
    const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^.{6,}$/; // Mindestens 6 Zeichen (Firebase Standard)

    // Reset Klassen
    name.classList.remove("invalid");
    email.classList.remove("invalid");
    pw.classList.remove("invalid");
    pwRepeat.classList.remove("invalid");
    
    let hasError = false; // Logik umgedreht für bessere Lesbarkeit (true = Fehler)

    if (name.value.trim() == "") {
        name.classList.add('invalid');
        hasError = true;
    }   
    if (!mailRegex.test(email.value)) {
        email.classList.add('invalid');
        hasError = true;
    }  
    if (!passwordRegex.test(pw.value)) {
        pw.classList.add('invalid');
        hasError = true;
    }   
    if (pw.value != pwRepeat.value || pwRepeat.value == "") {
        pwRepeat.classList.add('invalid');
        hasError = true;
    }
    if (!accept.checked) {
        alert("You must accept the Privacy Policy.");
        hasError = true;
    }

    return !hasError; // Gibt true zurück, wenn KEIN Fehler vorliegt
}

function getFirstAndLastInitial(fullName) {
    if (!fullName) return "NN";
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0][0];
    const last = parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] || "";
    return (first + last).toUpperCase();
}

// --------------------------------------------------------
// GLOBALE ZUWEISUNG (für HTML onclicks)
// --------------------------------------------------------
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.registerUser = registerUser;

/*
const name = document.getElementById("signup-name");
const email = document.getElementById("signup-email");
const pw = document.getElementById("signup-password");
const pwRepeat = document.getElementById("signup-password-repeat");
const accept = document.getElementById("accept-policy");
const pwError = document.querySelector(".false_password");
const BASE_URL = "https://join-ad1a9-default-rtdb.europe-west1.firebasedatabase.app/";

// Login with firebase Authentication
let manualLogin = false;

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";

// Firebase-Konfig
const firebaseConfig = {
    apiKey: "AIzaSyDSu3EKowLDqtiFCKaMWTVDG_PB-cIA5t0",
    authDomain: "join-ad1a9.firebaseapp.com",
    projectId: "join-ad1a9",
    appId: "1:159410908442:web:d2c57cbf551ca660add0a3"
};

// Start Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Login
function loginUser() {
    const email = document.getElementById("login-mail").value;
    const password = document.getElementById("login-password").value;
    document.querySelector(".false_password").style.display = "none";

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("Login erfolgreich:", userCredential.user.email);
            window.location.href = "summary.html";
        })
        .catch((error) => {
            manualLogin = false; 
            document.querySelector(".false_password").style.display = "block";
        });
}

// Auth State Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        const event = new CustomEvent("userReady", {
            detail: { name: user.displayName, email: user.email }
        });
        window.dispatchEvent(event);
        
        const icon = document.getElementById("personIcon");
        if (icon) {
            icon.textContent = getFirstAndLastInitial(user.displayName || "NN");
        }
        if (manualLogin && window.location.pathname.includes("index.html")) {
            manualLogin = false;
            window.location.href = "summary.html";
        }

    } else {
        console.log("Kein User eingeloggt");
    }
});

// Logout
function logoutUser() {
    const auth = getAuth(); 
    auth.signOut()
        .then(() => {
            console.log("Logout erfolgreich!"); 
            window.location.href = "index.html";           
        })
        .catch((error) => {
            console.error("Logout fehlgeschlagen:", error);
        });
}

// Sign up
export async function registerUser() {
    const registration =  confirmInput();
    if (registration) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email.value, pw.value);
            const user = userCredential.user;
            console.log("User erstellt:", user.uid);
            await updateProfile(user, {
                displayName: name.value
            });
            await postData("users", { name: name.value, email: email.value })
            window.location.href = "index.html";
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                alert("Diese Email wird bereits verwendet.");
                email.classList.add('invalid');
            } else {
                alert("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
            }
        }
    }
}

function confirmInput() {
    name.classList.remove("invalid");
    email.classList.remove("invalid");
    pw.classList.remove("invalid");
    pwRepeat.classList.remove("invalid");
    let hasError = true;
    if (name.value == "") {
        name.classList.add('invalid');
        hasError = false;
    }   
    if (!mailRegex.test(email.value)) {
        email.classList.add('invalid');
        hasError = false;
    }  
    if (!passwordRegex.test(pw.value)) {
        pw.classList.add('invalid');
        hasError = false;
    }   
    if (pw.value != pwRepeat.value || pwRepeat.value == "") {
        pwRepeat.classList.add('invalid');
        hasError = false;
    }
    if (!accept.checked) {
        alert("You must accept the Privacy Policy.");
        hasError = false;
    }
    return hasError;
}

function getFirstAndLastInitial(fullName) {
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0][0];
    const last = parts[parts.length - 1][0];
    return (first + last);
}

async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return await response.json();
}

// global functions
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.registerUser = registerUser;
*/
