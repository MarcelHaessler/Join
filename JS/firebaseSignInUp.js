import { auth, db } from "./firebaseAuth.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";

import {
    ref,
    push,
    set
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";

const name = document.getElementById("signup-name");
const email = document.getElementById("signup-email");
const pw = document.getElementById("signup-password");
const pwRepeat = document.getElementById("signup-password-repeat");
const accept = document.getElementById("accept-policy");
const pwError = document.querySelector(".false_password");
let manualLogin = false;

// LOGIN 
function loginUser() {
    const emailInput = document.getElementById("login-mail");
    const passwordInput = document.getElementById("login-password");
    const errorMsg = document.querySelector(".false_password");

    if (errorMsg) errorMsg.style.display = "none";

    signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
        .then((userCredential) => {
            manualLogin = true; // Markiere manuellen Login für Weiterleitung
            sessionStorage.setItem('showSummaryGreeting', 'true');
            sessionStorage.setItem('guestMode', 'false');
            window.location.href = "summary.html";
        })
        .catch((error) => {
            manualLogin = false;
            if (errorMsg) errorMsg.style.display = "block";
        });
}

// AUTH 
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
    } else {
        const event = new CustomEvent("guestUser", {
            detail: { name: 'Guest' }
        });
        window.dispatchEvent(event);
    }
});

// LOGOUT 
function logoutUser() {
    signOut(auth)
        .then(() => {
            window.location.href = "index.html";
        })
        .catch((error) => {
        });
}

// Sign up
export async function registerUser() {
    const isInputValid = confirmInput();

    if (isInputValid) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email.value, pw.value);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: name.value
            });

            const newUserRef = push(ref(db, "users"));
            await set(newUserRef, {
                name: name.value,
                email: email.value
            });
            window.location.href = "index.html";

        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                alert("Diese Email wird bereits verwendet.");
                email.classList.add('invalid');
            } else {
                alert("Ein Fehler ist aufgetreten: " + error.message);
            }
        }
    }
}

function confirmInput() {
    const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^.{6,}$/;

    const isNameValid = validateField(name, name.value.trim() !== "");
    const isEmailValid = validateField(email, mailRegex.test(email.value));
    const isPwValid = validateField(pw, passwordRegex.test(pw.value));
    const isPwCheckValid = validateField(pwRepeat, pw.value === pwRepeat.value && pwRepeat.value !== "");

    if (!accept.checked) {
        alert("You must accept the Privacy Policy.");
        return false;
    }

    return isNameValid && isEmailValid && isPwValid && isPwCheckValid;
}

function validateField(element, condition) {
    if (condition) {
        element.classList.remove("invalid");
        return true;
    } else {
        element.classList.add("invalid");
        return false;
    }
}

function getFirstAndLastInitial(fullName) {
    if (!fullName) return "NN";
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0][0];
    const last = parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] || "";
    return (first + last).toUpperCase();
}

window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.registerUser = registerUser;
