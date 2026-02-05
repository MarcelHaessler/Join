/**
 * Validation logic for user registration on the SignUp page
 */

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
    if (messageContainer) {
        messageContainer.classList.add('active');
    }
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
