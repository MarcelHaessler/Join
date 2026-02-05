/**
 * Event listeners and UI interactions for authentication forms.
 * Depends on: auth_ui_validation.js
 */

/**
 * Toggles the privacy policy checkbox icon.
 * @returns {void}
 */
function activateCheckbox() {
    const checkbox = document.getElementById("checkbox");
    if (checkbox.src.includes("checkbox_inactive.svg")) {
        checkbox.src = "./assets/img/checkbox_active.svg"
    } else {
        checkbox.src = "./assets/img/checkbox_inactive.svg"
    }
}

/**
 * Handles blur events for form inputs to trigger validation.
 * @param {HTMLInputElement} input - The input element.
 * @returns {void}
 */
function handleBlur(input) {
    if (input.placeholder === 'Name') validateName(input.value, input, true);
    else if (input.type === 'email') {
        if (input.id === 'login-mail') {
            validateLoginEmail(input.value, input, true);
        } else {
            validateEmail(input.value, input, true);
        }
    }
    else if (input.placeholder === 'Password' && input.id !== 'login-password') validatePassword(input.value, input, true);
    else if (input.placeholder === 'Confirm Password') {
        validateConfirmPassword(input.value, input);
        updatePasswordMessage(true);
    }
}

/**
 * Adds input listeners for email fields.
 * @param {HTMLInputElement} input - The email input.
 * @returns {void}
 */
function addEmailInputListener(input) {
    if (input.id === 'login-mail') {
        input.addEventListener('input', () => validateLoginEmail(input.value, input));
    } else {
        input.addEventListener('input', () => validateEmail(input.value, input));
    }
}

/**
 * Adds input listener for password field.
 * @param {HTMLInputElement} input - The password input.
 * @returns {void}
 */
function addPasswordInputListener(input) {
    input.addEventListener('input', () => validatePassword(input.value, input));
}

/**
 * Adds input listener for confirm password field.
 * @param {HTMLInputElement} input - The confirm password input.
 * @returns {void}
 */
function addConfirmPasswordListener(input) {
    input.addEventListener('input', () => {
        validateConfirmPassword(input.value, input);
        updatePasswordMessage(false);
    });
}

/**
 * Attaches input listeners based on input type
 * @param {HTMLInputElement} input - The input element
 * @returns {void}
 */
function attachInputTypeListeners(input) {
    if (input.type === 'email') addEmailInputListener(input);
    if (input.placeholder === 'Name') input.addEventListener('input', () => validateName(input.value, input));
    if (input.placeholder === 'Password' && input.id !== 'login-password') addPasswordInputListener(input);
    if (input.placeholder === 'Confirm Password') addConfirmPasswordListener(input);
}

/**
 * Initializes all input validation listeners
 * @returns {void}
 */
function initInputListeners() {
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('blur', () => handleBlur(input));
        attachInputTypeListeners(input);
    });
}

initInputListeners();

/**
 * Toggles password visibility for a specific icon
 * @param {HTMLElement} icon - The visibility toggle icon
 * @returns {void}
 */
function togglePasswordVisibility(icon) {
    const passwordInput = icon.parentElement.querySelector('input');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.src = './assets/img/visibility_on.svg';
    } else {
        passwordInput.type = 'password';
        icon.src = './assets/img/visibility_off.svg';
    }
}

/**
 * Initializes password visibility toggle listeners
 * @returns {void}
 */
function initPasswordToggleListeners() {
    document.querySelectorAll('.inputIcon.clickable').forEach(icon => {
        icon.addEventListener('click', () => togglePasswordVisibility(icon));
    });
}

initPasswordToggleListeners();
