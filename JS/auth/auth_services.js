/**
 * Core Authentication Services and State Management
 * Handles user login, logout, session management, and database interactions.
 */

const name = document.getElementById("signup-name");
const email = document.getElementById("signup-email");
const pw = document.getElementById("signup-password");
const pwRepeat = document.getElementById("signup-password-repeat");
const accept = document.getElementById("accept-policy");

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
 * Extracts first and last initials from a full name
 * @param {string} fullName - The full name to extract initials from
 * @returns {string} Two-letter initials or "NN" if name is empty
 */
function getFirstAndLastInitial(fullName) {
    if (!fullName) return "NN";
    const parts = fullName.trim().split(/\\s+/);
    const first = parts[0][0];
    const last = parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] || "";
    return (first + last).toUpperCase();
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
        const event = new CustomEvent("guestUser", { detail: { name: 'Guest' } });
        window.dispatchEvent(event);
    }
}

/**
 * Initializes authentication state check on page load
 * Sets up event listener for window load event
 * @returns {void}
 */
function initAuthStateCheck() {
    window.addEventListener('load', () => {
        checkAuthState();
    });
}

initAuthStateCheck();

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
