import { db } from "./firebaseAuth.js";

import {
    ref,
    push,
    set,
    get,
    child
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";

const name = document.getElementById("signup-name");
const email = document.getElementById("signup-email");
const pw = document.getElementById("signup-password");
const pwRepeat = document.getElementById("signup-password-repeat");
const accept = document.getElementById("accept-policy");
const pwError = document.querySelector(".false_password");

// Generate unique user ID
function generateUserId() {
    return 'user_' + Date.now();
}

// Helper: Get users from Firebase DB or localStorage as fallback
async function getUsersFromDB() {
    try {
        const usersRef = ref(db, 'users');
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
            const usersObj = snapshot.val();
            return Object.keys(usersObj).map(key => ({
                firebaseKey: key,
                ...usersObj[key]
            }));
        }
        return [];
    } catch (error) {
        const usersData = localStorage.getItem('join_users');
        return usersData ? JSON.parse(usersData) : [];
    }
}

// Helper: Save user to Firebase DB or localStorage as fallback
async function saveUserToDB(userData) {
    try {
        const newUserRef = push(ref(db, "users"));
        await set(newUserRef, userData);
        return newUserRef.key;
    } catch (error) {
        const users = JSON.parse(localStorage.getItem('join_users') || '[]');
        users.push(userData);
        localStorage.setItem('join_users', JSON.stringify(users));
        return userData.uid;
    }
}

// Helper: Get current user
function getCurrentUser() {
    const userData = localStorage.getItem('join_current_user');
    return userData ? JSON.parse(userData) : null;
}

// Helper: Set current user
function setCurrentUser(user) {
    localStorage.setItem('join_current_user', JSON.stringify(user));
    dispatchUserEvent(user);
}

// Helper: Clear current user
function clearCurrentUser() {
    localStorage.removeItem('join_current_user');
}

// Dispatch user ready event
function dispatchUserEvent(user) {
    if (user.isGuest) {
        const event = new CustomEvent("guestUser", {
            detail: { name: user.name, uid: user.uid }
        });
        window.dispatchEvent(event);
        const icon = document.getElementById("personIcon");
        if (icon) icon.textContent = getFirstAndLastInitial(user.name);
    } else {
        const event = new CustomEvent("userReady", {
            detail: { name: user.name, email: user.email, uid: user.uid }
        });
        window.dispatchEvent(event);
        const icon = document.getElementById("personIcon");
        if (icon) icon.textContent = getFirstAndLastInitial(user.name);
    }
}

// Check auth state on page load
function checkAuthState() {
    const user = getCurrentUser();
    if (user) {
        dispatchUserEvent(user);
    } else {
        const event = new CustomEvent("guestUser", { detail: { name: 'Guest' }});
        window.dispatchEvent(event);
    }
}

// Run auth check when page is fully loaded (after all scripts)
window.addEventListener('load', () => {
    checkAuthState();
});

// LOGIN 
async function loginUser() {
    const emailInput = document.getElementById("login-mail");
    const passwordInput = document.getElementById("login-password");
    const errorMsg = document.querySelector(".false_password");

    if (errorMsg) errorMsg.classList.remove("show");

    const users = await getUsersFromDB();
    const user = users.find(u => u.email === emailInput.value && u.password === passwordInput.value);

    if (user) {
        setCurrentUser({
            name: user.name,
            email: user.email,
            uid: user.uid,
            isGuest: false
        });
        sessionStorage.setItem('showSummaryGreeting', 'true');
        sessionStorage.setItem('guestMode', 'false');
        window.location.href = "summary.html";
    } else {
        if (errorMsg) errorMsg.classList.add("show");
    }
}

// GUEST LOGIN
function guestLogin() {
    const guestUser = {
        name: "Guest",
        uid: generateUserId(),
        isGuest: true
    };
    setCurrentUser(guestUser);
    sessionStorage.setItem('guestMode', 'true');
    sessionStorage.setItem('showSummaryGreeting', 'true');
    window.location.href = "summary.html";
}

function logoutUser() {
    clearCurrentUser();
    sessionStorage.removeItem('guestMode');
    sessionStorage.removeItem('showSummaryGreeting');
    window.location.href = "index.html";
}

// Sign up
export async function registerUser() {
    const isInputValid = confirmInput();

    if (isInputValid) {
        const users = await getUsersFromDB();
        
        // Check if email already exists
        if (users.find(u => u.email === email.value)) {
            alert("Diese Email wird bereits verwendet.");
            email.classList.add('invalid');
            return;
        }

        const uid = generateUserId();
        const newUser = {
            uid: uid,
            name: name.value,
            email: email.value,
            password: pw.value
        };

        try {
            await saveUserToDB(newUser);
            window.location.href = "index.html";
        } catch (error) {
            alert("Ein Fehler ist aufgetreten: " + error.message);
        }
    }
}

function setPasswordRepeatError(message, text) {
    if (message) {
        message.innerHTML = text;
        message.classList.add("show");
    }
    pw.classList.add("invalid");
    pwRepeat.classList.add("invalid");
}

function clearPasswordRepeatError(message) {
    pw.classList.remove("invalid");
    pwRepeat.classList.remove("invalid");
    if (message) message.classList.remove("show");
}

function validatePasswordRepeat() {
    const passwordRegex = /^(?=.*[0-9]).{8,}$/;
    const isPwCriteriaValid = passwordRegex.test(pw.value);
    const pwsMatch = pw.value === pwRepeat.value;
    const pwRepeatFilled = pwRepeat.value !== "";
    const message = document.querySelector('#password_repeat_message');
    
    if (!isPwCriteriaValid) {
        setPasswordRepeatError(message, "Password requirements not met.");
        return false;
    }
    if (!pwRepeatFilled || !pwsMatch) {
        setPasswordRepeatError(message, "Passwords does not match, please try again.");
        return false;
    }
    clearPasswordRepeatError(message);
    return true;
}

function validatePrivacyCheckbox() {
    if (!accept.checked) {
        if (window.validatePrivacyPolicy) window.validatePrivacyPolicy(accept);
        return false;
    }
    if (window.validatePrivacyPolicy) window.validatePrivacyPolicy(accept);
    return true;
}

function confirmInput() {
    const nameRegex = /^[a-zA-ZäöüÄÖÜß\s'-]{2,}$/;
    const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[0-9]).{8,}$/;

    const isNameValid = validateField(name, nameRegex.test(name.value.trim()), '#name_message');
    const isEmailValid = validateField(email, mailRegex.test(email.value), '#email_message');
    const isPwValid = validateField(pw, passwordRegex.test(pw.value), '#password_message');
    const isPwCheckValid = validatePasswordRepeat();
    const isPrivacyAccepted = validatePrivacyCheckbox();

    return isNameValid && isEmailValid && isPwValid && isPwCheckValid && isPrivacyAccepted;
}

function validateField(element, condition, messageSelector) {
    const message = document.querySelector(messageSelector);
    if (condition) {
        element.classList.remove("invalid");
        if (message) message.classList.remove("show");
        return true;
    } else {
        element.classList.add("invalid");
        if (message) message.classList.add("show");
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
window.guestLogin = guestLogin;