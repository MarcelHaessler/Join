/**
 * Validation logic for authentication form inputs (Name, Email, Password).
 */

/**
 * Regular expression for validating email addresses.
 * @type {RegExp}
 */
const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Regular expression for validating passwords (min 8 chars, at least 1 digit).
 * @type {RegExp}
 */
const passwordRegex = /^(?=.*[0-9]).{8,}$/;

/**
 * Checks if name input should be cleared
 * @param {string} name - The name value
 * @param {boolean} onBlur - Whether triggered by blur
 * @returns {boolean} True if should clear validation
 */
function shouldClearNameValidation(name, onBlur) {
    return name.trim() === '' && !onBlur;
}

/**
 * Applies name validation result to UI
 * @param {boolean} isValid - Whether name is valid
 * @param {HTMLInputElement} input - The input element
 * @param {HTMLElement} message - The message element
 * @returns {void}
 */
function applyNameValidationResult(isValid, input, message) {
    if (isValid) {
        input.classList.remove('invalid');
        message.classList.remove('show');
    } else {
        input.classList.add('invalid');
        message.classList.add('show');
    }
}

/**
 * Validates the name input.
 * @param {string} name - The name value.
 * @param {HTMLInputElement} input - The input element.
 * @param {boolean} [onBlur=false] - Whether triggered by blur.
 * @returns {void}
 */
function validateName(name, input, onBlur = false) {
    const message = document.querySelector('#name_message');
    const nameRegex = /^[a-zA-ZäöüÄÖÜß\s'-]{2,}$/;
    if (!message) return;

    if (shouldClearNameValidation(name, onBlur)) {
        input.classList.remove('invalid');
        message.classList.remove('show');
        return;
    }

    const isValid = nameRegex.test(name.trim());
    applyNameValidationResult(isValid, input, message);
}

/**
 * Applies email validation result to UI
 * @param {boolean} isValid - Whether email is valid
 * @param {HTMLInputElement} input - The input element
 * @param {HTMLElement} message - The message element
 * @returns {void}
 */
function applyEmailValidationResult(isValid, input, message) {
    if (isValid) {
        input.classList.remove('invalid');
        message.classList.remove('show');
    } else {
        input.classList.add('invalid');
        message.classList.add('show');
    }
}

/**
 * Validates the email input for registration.
 * @param {string} email - The email value.
 * @param {HTMLInputElement} input - The input element.
 * @param {boolean} [onBlur=false] - Whether triggered by blur.
 * @returns {void}
 */
function validateEmail(email, input, onBlur = false) {
    const message = document.querySelector('#email_message');
    if (!message) return;

    if (email === '' && !onBlur) {
        input.classList.remove('invalid');
        message.classList.remove('show');
        return;
    }

    const isValid = mailRegex.test(email);
    applyEmailValidationResult(isValid, input, message);
}

/**
 * Validates the email input for login.
 * @param {string} email - The email value.
 * @param {HTMLInputElement} input - The input element.
 * @param {boolean} [onBlur=false] - Whether triggered by blur.
 * @returns {void}
 */
function validateLoginEmail(email, input, onBlur = false) {
    const message = document.querySelector('.false_email');
    if (!message) return;

    if (email === '' && !onBlur) {
        input.classList.remove('invalid');
        message.classList.remove('show');
        return;
    }

    const isValid = mailRegex.test(email);
    applyEmailValidationResult(isValid, input, message);
}

/**
 * Re-checks confirm password field.
 * @returns {void}
 */
function recheckConfirmPassword() {
    const confirmPasswordInput = document.getElementById('signup-password-repeat');
    if (confirmPasswordInput && confirmPasswordInput.value !== '') {
        validateConfirmPassword(confirmPasswordInput.value, confirmPasswordInput);
        updatePasswordMessage();
    }
}

/**
 * Applies password validation result to UI
 * @param {boolean} isValid - Whether password is valid
 * @param {HTMLInputElement} input - The input element
 * @param {HTMLElement} message - The message element
 * @returns {void}
 */
function applyPasswordValidationResult(isValid, input, message) {
    if (isValid) {
        input.classList.remove('invalid');
        message.classList.remove('show');
    } else {
        input.classList.add('invalid');
        message.classList.add('show');
    }
}

/**
 * Validates the password input.
 * @param {string} password - The password value.
 * @param {HTMLInputElement} input - The input element.
 * @param {boolean} [onBlur=false] - Whether triggered by blur.
 * @returns {void}
 */
function validatePassword(password, input, onBlur = false) {
    const message = document.querySelector('#password_message');
    if (!message) return;

    if (password === '' && !onBlur) {
        input.classList.remove('invalid');
        message.classList.remove('show');
        recheckConfirmPassword();
        return;
    }

    const isValid = passwordRegex.test(password);
    applyPasswordValidationResult(isValid, input, message);
    recheckConfirmPassword();
}

/**
 * Trigger validation for confirm password (wrapper).
 * @param {string} password - The password value.
 * @param {HTMLInputElement} input - The input element.
 * @returns {void}
 */
function validateConfirmPassword(password, input) {
    updatePasswordMessage();
}

/**
 * Updates the password match validation message.
 * @param {boolean} [onBlur=false] - Whether triggered by blur event.
 * @returns {void}
 */
function updatePasswordMessage(onBlur = false) {
    const passwordInput = document.getElementById('signup-password');
    const confirmPasswordInput = document.getElementById('signup-password-repeat');
    const message = document.getElementById('password_repeat_message');

    if (!passwordInput || !confirmPasswordInput || !message) return;

    if (confirmPasswordInput.value === '' && !onBlur) {
        clearPasswordValidation(message, confirmPasswordInput);
        return;
    }

    validatePasswordMatch(passwordInput, confirmPasswordInput, message);
}

/**
 * Clears password validation states.
 * @param {HTMLElement} message - The message element.
 * @param {HTMLInputElement} confirmPasswordInput - The confirm password input.
 * @returns {void}
 */
function clearPasswordValidation(message, confirmPasswordInput) {
    message.classList.remove('show');
    confirmPasswordInput.classList.remove('invalid');
}

/**
 * Validates if passwords match and meet criteria.
 * @param {HTMLInputElement} passwordInput - The password input.
 * @param {HTMLInputElement} confirmPasswordInput - The confirm password input.
 * @param {HTMLElement} message - The message element.
 * @returns {void}
 */
function validatePasswordMatch(passwordInput, confirmPasswordInput, message) {
    const isPwCriteriaValid = passwordRegex.test(passwordInput.value);
    const passwordsMatch = passwordInput.value === confirmPasswordInput.value;

    if (!isPwCriteriaValid) {
        showPasswordError(message, confirmPasswordInput, "Password requirements not met.");
    } else if (!passwordsMatch) {
        showPasswordMismatchError(message, passwordInput, confirmPasswordInput);
    } else {
        clearAllPasswordErrors(message, passwordInput, confirmPasswordInput);
    }
}

/**
 * Shows a general password error.
 * @param {HTMLElement} message - The message element.
 * @param {HTMLInputElement} input - The input element.
 * @param {string} text - The error text.
 * @returns {void}
 */
function showPasswordError(message, input, text) {
    message.innerHTML = text;
    message.classList.add('show');
    input.classList.add('invalid');
}

/**
 * Shows a password mismatch error.
 * @param {HTMLElement} message - The message element.
 * @param {HTMLInputElement} passwordInput - The password input.
 * @param {HTMLInputElement} confirmPasswordInput - The confirm input.
 * @returns {void}
 */
function showPasswordMismatchError(message, passwordInput, confirmPasswordInput) {
    message.innerHTML = "Passwords does not match, please try again.";
    message.classList.add('show');
    passwordInput.classList.add('invalid');
    confirmPasswordInput.classList.add('invalid');
}

/**
 * Clears all password errors.
 * @param {HTMLElement} message - The message element.
 * @param {HTMLInputElement} passwordInput - The password input.
 * @param {HTMLInputElement} confirmPasswordInput - The confirm input.
 * @returns {void}
 */
function clearAllPasswordErrors(message, passwordInput, confirmPasswordInput) {
    message.classList.remove('show');
    passwordInput.classList.remove('invalid');
    confirmPasswordInput.classList.remove('invalid');
}

/**
 * Validates privacy policy checkbox state.
 * @param {HTMLInputElement} checkbox - The checkbox element.
 * @returns {void}
 */
function validatePrivacyPolicy(checkbox) {
    const message = document.querySelector('#privacy_policy_message');
    if (!message) return;
    if (checkbox.checked) {
        message.classList.remove('show');
    } else {
        message.classList.add('show');
    }
}
