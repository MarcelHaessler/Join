const false_password = document.querySelector('.false_password');


// Checkbox activation
function activateCheckbox() {
    const checkbox = document.getElementById("checkbox");
    if (checkbox.src.includes("checkbox_inactive.svg")){
        checkbox.src="./assets/img/checkbox_active.svg"
    }else{
        checkbox.src="./assets/img/checkbox_inactive.svg"
    }
}

// function hoverBackButton() {
//     const backButton = document.getElementById("back_button");
//     backButton.src="./assets/img/back_button_active.svg"
// }
// function unhoverBackButton() {
//     const backButton = document.getElementById("back_button");
//     backButton.src="./assets/img/back_button_inactive.svg"
// }

// window.onload = () => {
//     document.body.classList.add('loaded');
// };


const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^.{4,}$/;

// Input validation on blur and red border for invalid inputs
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', () => {
        if (input.type === 'email') {
            validateEmail(input.value, input);
        }
        if (input.placeholder === 'Password') { 
            validatePassword(input.value, input)
        }
    });
});

function validateEmail(email, input) {
    if (mailRegex.test(email)) {
        input.classList.remove('invalid');
        false_password.classList.remove('show');
    } else {
        input.classList.add('invalid');
        false_password.classList.add('show');
    }
}

function validatePassword(password, input) {
    if (passwordRegex.test(password)) {
        input.classList.remove('invalid');
        false_password.classList.remove('show');
    } else {
        input.classList.add('invalid');
        false_password.classList.add('show');
    }
}


// Password visibility toggle
document.querySelectorAll('.inputIcon.clickable').forEach(icon => {
    icon.addEventListener('click', () => {
        const passwordInput = icon.parentElement.querySelector('input');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.src = './assets/img/visibility_on.svg';
        } else {
            passwordInput.type = 'password';
            icon.src = './assets/img/visibility_off.svg';
        }
    });
});


// Login with firebase Authentication
//

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";

// ✨ Deine Firebase-Konfiguration einfügen
const firebaseConfig = {
    apiKey: "AIzaSyDSu3EKowLDqtiFCKaMWTVDG_PB-cIA5t0",
    authDomain: "join-ad1a9.firebaseapp.com",
    projectId: "join-ad1a9",
    appId: "1:159410908442:web:d2c57cbf551ca660add0a3"
};

// Firebase starten
const app = initializeApp(firebaseConfig);
const auth = getAuth();


// --- LOGIN FUNKTION ---
function loginUser() {
    const email = document.getElementById("login-mail").value;
    const password = document.getElementById("login-password").value;

    document.querySelector(".false_password").style.display = "none";

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            console.log("Login erfolgreich!" + userCredential.user.email + "..." + userCredential.user.uid);
            // sessionStorage.setItem("userEmail", userCredential.user.email);
            // sessionStorage.setItem("userUid", userCredential.user.uid);
        })
        .catch((error) => {
            console.error(error);
            document.querySelector(".false_password").style.display = "block";
        });
}

// wichtig: Funktion für HTML global verfügbar machen
window.loginUser = loginUser;


// --- STATUS ÄNDERT SICH (optional) ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Eingeloggt als:", user.email);
        window.location.href = "index.html";
    } else {
        console.log("Nicht eingeloggt");
    }
});

// Logout
//
function logoutUser() {
    const auth = getAuth(); // sicherstellen, dass auth definiert ist
    auth.signOut()
        .then(() => {
            console.log("Logout erfolgreich!");
            // Optional: Weiterleitung zurück zur Login-Seite
            window.location.href = "./log_in.html";
            
        })
        .catch((error) => {
            console.error("Logout fehlgeschlagen:", error);
        });
}

// global verfügbar machen
window.logoutUser = logoutUser;


// const BaseUrl = 'https://join-ad1a9-default-rtdb.europe-west1.firebasedatabase.app/';

// async function loadData() {
//     let response = await fetch(BaseUrl + '.json');
//     let data = await response.json();
//     console.log(data);
// }

// async function sendData() {
//     const data = { "email": "test@example.com", "pw": "1234" };

//     let response = await fetch(BaseUrl + '/Login.json', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data)
//     });
//     return responseToJson = await response.json();
// }
