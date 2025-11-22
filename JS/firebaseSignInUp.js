const name = document.getElementById("signup-name");
const email = document.getElementById("signup-email");
const pw = document.getElementById("signup-password");
const pwRepeat = document.getElementById("signup-password-repeat");
const accept = document.getElementById("accept-policy");
const pwError = document.querySelector(".false_password");

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
    manualLogin = true;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("Login erfolgreich:", userCredential.user.email);
        })
        .catch((error) => {
            manualLogin = false; 
            document.querySelector(".false_password").style.display = "block";
        });
}

// Auth State Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User ist eingeloggt:", user.email);
        console.log("Display Name:", user.displayName);

        const icon = document.getElementById("personIcon");
        if (icon) {
            icon.textContent = getFirstAndLastInitial(user.displayName || "NN");
        }
        if (manualLogin && window.location.pathname.includes("log_in.html")) {
            manualLogin = false;
            window.location.href = "index.html";
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
            window.location.href = "log_in.html";           
        })
        .catch((error) => {
            console.error("Logout fehlgeschlagen:", error);
        });
}

// Sign up
export async function registerUser() {
    const registration =  confirmInput();
    console.log(registration);
    if (registration) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email.value, pw.value);
            const user = userCredential.user;
            console.log("User erstellt:", user.uid);
            await updateProfile(user, {
                displayName: name.value
            });
            console.log("Profil aktualisiert mit Name:", name.value);
            window.location.href = "index.html";
        } catch (error) {
            console.error("Fehler beim Erstellen:", error);
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

// global functions
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.registerUser = registerUser;