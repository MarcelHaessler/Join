const name = document.getElementById("signup-name");
const email = document.getElementById("signup-email");
const pw = document.getElementById("signup-password");
const pwRepeat = document.getElementById("signup-password-repeat");
const accept = document.getElementById("accept-policy");
const pwError = document.querySelector(".false_password");

/**
 * Generates a unique user ID based on current timestamp
 * @returns {string} Unique user ID in format 'user_timestamp'
 */
function generateUserId() {
    return 'user_' + Date.now();
}

/**
 * Gets users from Firebase database or localStorage as fallback
 * @async
 * @returns {Promise<Array>} Array of user objects
 */
async function getUsersFromDB() {
    try {
        return await fetchUsersFromFirebase();
    } catch (error) {
        return getUsersFromLocalStorage();
    }
}

/**
 * Fetches all users from Firebase database
 * @async
 * @returns {Promise<Array>} Array of user objects with Firebase keys
 */
async function fetchUsersFromFirebase() {
    const usersRef = db.ref('users');
    const snapshot = await usersRef.get();
    if (snapshot.exists()) {
        const usersObj = snapshot.val();
        return Object.keys(usersObj).map(key => ({
            firebaseKey: key,
            ...usersObj[key]
        }));
    }
    return [];
}

/**
 * Gets users from localStorage
 * @returns {Array} Array of user objects from localStorage
 */
function getUsersFromLocalStorage() {
    const usersData = localStorage.getItem('join_users');
    return usersData ? JSON.parse(usersData) : [];
}

/**
 * Saves a user to Firebase database or localStorage as fallback
 * @async
 * @param {Object} userData - The user data to save
 * @returns {Promise<string>} The Firebase key or user ID
 */
async function saveUserToDB(userData) {
    try {
        const newUserRef = db.ref("users").push();
        await newUserRef.set(userData);
        return newUserRef.key;
    } catch (error) {
        const users = JSON.parse(localStorage.getItem('join_users') || '[]');
        users.push(userData);
        localStorage.setItem('join_users', JSON.stringify(users));
        return userData.uid;
    }
}

/**
 * Gets the current user from localStorage
 * @returns {Object|null} Current user object or null if not logged in
 */
function getCurrentUser() {
    const userData = localStorage.getItem('join_current_user');
    return userData ? JSON.parse(userData) : null;
}

/**
 * Sets the current user in localStorage and dispatches user event
 * @param {Object} user - The user object to set as current
 * @returns {void}
 */
function setCurrentUser(user) {
    localStorage.setItem('join_current_user', JSON.stringify(user));
    dispatchUserEvent(user);
}

/**
 * Clears the current user from localStorage
 * @returns {void}
 */
function clearCurrentUser() {
    localStorage.removeItem('join_current_user');
}

/**
 * Dispatches a custom event with user data
 * @param {Object} user - The user object
 * @returns {void}
 */
function dispatchUserEvent(user) {
    const eventType = user.isGuest ? "guestUser" : "userReady";
    const eventDetail = getEventDetail(user);
    const event = new CustomEvent(eventType, { detail: eventDetail });
    window.dispatchEvent(event);
    updatePersonIcon(user.name);
}

/**
 * Gets the event detail object based on user type
 * @param {Object} user - The user object
 * @returns {Object} Event detail object with user data
 */
function getEventDetail(user) {
    return user.isGuest 
        ? { name: user.name, uid: user.uid } 
        : { name: user.name, email: user.email, uid: user.uid };
}

/**
 * Updates the person icon with user initials
 * @param {string} userName - The user's name
 * @returns {void}
 */
function updatePersonIcon(userName) {
    const icon = document.getElementById("personIcon");
    if (icon) icon.textContent = getFirstAndLastInitial(userName);
}

/**
 * Checks authentication state on page load
 * Dispatches appropriate event based on current user
 * @returns {void}
 */
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

/**
 * Handles user login by validating credentials
 * @async
 * @returns {Promise<void>}
 */
async function loginUser() {
    const emailInput = document.getElementById("login-mail");
    const passwordInput = document.getElementById("login-password");
    const errorMsg = document.querySelector(".false_password");

    if (errorMsg) errorMsg.classList.remove("show");

    const users = await getUsersFromDB();
    const user = users.find(u => u.email === emailInput.value && u.password === passwordInput.value);

    if (user) {
        handleSuccessfulLogin(user, emailInput, passwordInput);
    } else {
        handleFailedLogin(emailInput, passwordInput, errorMsg);
    }
}

/**
 * Handles successful login by setting user data and redirecting
 * @param {Object} user - The authenticated user object
 * @param {HTMLInputElement} emailInput - The email input element
 * @param {HTMLInputElement} passwordInput - The password input element
 * @returns {void}
 */
function handleSuccessfulLogin(user, emailInput, passwordInput) {
    emailInput.classList.remove("invalid");
    passwordInput.classList.remove("invalid");
    setCurrentUser({
        name: user.name,
        email: user.email,
        uid: user.uid,
        isGuest: false
    });
    sessionStorage.setItem('showSummaryGreeting', 'true');
    sessionStorage.setItem('guestMode', 'false');
    window.location.href = "summary.html";
}

/**
 * Handles failed login by showing error states
 * @param {HTMLInputElement} emailInput - The email input element
 * @param {HTMLInputElement} passwordInput - The password input element
 * @param {HTMLElement} errorMsg - The error message element
 * @returns {void}
 */
function handleFailedLogin(emailInput, passwordInput, errorMsg) {
    emailInput.classList.add("invalid");
    passwordInput.classList.add("invalid");
    if (errorMsg) errorMsg.classList.add("show");
}

/**
 * Logs in as a guest user and redirects to summary
 * @returns {void}
 */
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

/**
 * Logs out the current user and redirects to index
 * @returns {void}
 */
function logoutUser() {
    clearCurrentUser();
    sessionStorage.removeItem('guestMode');
    sessionStorage.removeItem('showSummaryGreeting');
    window.location.href = "index.html";
}

/**
 * Registers a new user after validation
 * @async
 * @returns {Promise<void>}
 */
async function registerUser() {
    const isInputValid = confirmInput();
    if (!isInputValid) return;
    
    const users = await getUsersFromDB();
    if (isEmailTaken(users)) return;
    
    await createAndSaveNewUser();
}

/**
 * Checks if email is already registered
 * @param {Array} users - Array of existing users
 * @returns {boolean} True if email is taken, false otherwise
 */
function isEmailTaken(users) {
    if (users.find(u => u.email === email.value)) {
        alert("Diese Email wird bereits verwendet.");
        email.classList.add('invalid');
        return true;
    }
    return false;
}

/**
 * Creates and saves a new user to the database
 * Shows success message after registration
 * @async
 * @returns {Promise<void>}
 */
async function createAndSaveNewUser() {
    const uid = generateUserId();
    const newUser = {
        uid: uid,
        name: name.value,
        email: email.value,
        password: pw.value
    };

    try {
        await saveUserToDB(newUser);
        showRegistrationMessage();
    } catch (error) {
        alert("Ein Fehler ist aufgetreten: " + error.message);
    }
}

/**
 * Shows registration success message and redirects to login
 * @returns {void}
 */
function showRegistrationMessage() {
    disableAllClicks();
    let messageContainer = document.getElementById('registration-message');
    messageContainer.classList.add('active');
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
}

/**
 * Disables all click events except on message container
 * @returns {void}
 */
function disableAllClicks() {
    document.body.style.pointerEvents = 'none';
    const messageContainer = document.getElementById('registration-message');
    if (messageContainer) {
        messageContainer.style.pointerEvents = 'auto';
    }
}

/**
 * Sets error state for password repeat validation
 * @param {HTMLElement} message - The error message element
 * @param {string} text - The error text to display
 * @returns {void}
 */
function setPasswordRepeatError(message, text) {
    if (message) {
        message.innerHTML = text;
        message.classList.add("show");
    }
    pw.classList.add("invalid");
    pwRepeat.classList.add("invalid");
}

/**
 * Clears error state for password repeat validation
 * @param {HTMLElement} message - The error message element
 * @returns {void}
 */
function clearPasswordRepeatError(message) {
    pw.classList.remove("invalid");
    pwRepeat.classList.remove("invalid");
    if (message) message.classList.remove("show");
}

/**
 * Validates password repeat field
 * Checks password criteria and matching
 * @returns {boolean} True if validation passes, false otherwise
 */
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

/**
 * Validates that privacy policy checkbox is checked
 * @returns {boolean} True if checked, false otherwise
 */
function validatePrivacyCheckbox() {
    if (!accept.checked) {
        if (window.validatePrivacyPolicy) window.validatePrivacyPolicy(accept);
        return false;
    }
    if (window.validatePrivacyPolicy) window.validatePrivacyPolicy(accept);
    return true;
}

/**
 * Validates all registration form inputs
 * @returns {boolean} True if all validations pass, false otherwise
 */
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

/**
 * Validates a single form field and shows/hides error message
 * @param {HTMLElement} element - The form element to validate
 * @param {boolean} condition - The validation condition
 * @param {string} messageSelector - CSS selector for error message element
 * @returns {boolean} True if validation passes, false otherwise
 */
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

/**
 * Extracts first and last initials from a full name
 * @param {string} fullName - The full name to extract initials from
 * @returns {string} Two-letter initials or "NN" if name is empty
 */
function getFirstAndLastInitial(fullName) {
    if (!fullName) return "NN";
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0][0];
    const last = parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] || "";
    return (first + last).toUpperCase();
}