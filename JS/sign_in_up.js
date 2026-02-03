const false_password = document.querySelector('.false_password');
const pw = document.getElementById("signup-password");
const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[0-9]).{8,}$/;

function activateCheckbox() {
    const checkbox = document.getElementById("checkbox");
    if (checkbox.src.includes("checkbox_inactive.svg")) {
        checkbox.src = "./assets/img/checkbox_active.svg"
    } else {
        checkbox.src = "./assets/img/checkbox_inactive.svg"
    }
}

function handleBlur(input) {
    if (input.placeholder === 'Name') validateName(input.value, input);
    else if (input.type === 'email') {
        if (input.id === 'login-mail') {
            validateLoginEmail(input.value, input);
        } else {
            validateEmail(input.value, input);
        }
    }
    else if (input.placeholder === 'Password' && input.id !== 'login-password') validatePassword(input.value, input);
    else if (input.placeholder === 'Confirm Password') {
        validateConfirmPassword(input.value, input);
        updatePasswordMessage();
    } else {
        input.addEventListener('input', () => validateEmail(input.value, input));
    }
}

function addEmailInputListener(input) {
    if (input.id === 'login-mail') {
        input.addEventListener('input', () => validateLoginEmail(input.value, input));
    } else {
        input.addEventListener('input', () => validateEmail(input.value, input));
    }
}

function addPasswordInputListener(input) {
    input.addEventListener('input', () => validatePassword(input.value, input));
}

function addConfirmPasswordListener(input) {
    input.addEventListener('input', () => {
        validateConfirmPassword(input.value, input);
        updatePasswordMessage();
    });
}

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', () => handleBlur(input));
    if (input.type === 'email') {
        addEmailInputListener(input);
    }
    if (input.placeholder === 'Name') {
        input.addEventListener('input', () => validateName(input.value, input));
    }
    if (input.placeholder === 'Password' && input.id !== 'login-password') {
        addPasswordInputListener(input);
    }
    if (input.placeholder === 'Confirm Password') {
        addConfirmPasswordListener(input);
    }
});

function updatePasswordMessage() {
    const passwordInput = document.getElementById('signup-password');
    const confirmPasswordInput = document.getElementById('signup-password-repeat');
    const message = document.getElementById('password_repeat_message');
    
    if (!passwordInput || !confirmPasswordInput || !message) return;
    
    if (confirmPasswordInput.value === '') {
        message.classList.remove('show');
        confirmPasswordInput.classList.remove('invalid');
        return;
    }
    
    const isPwCriteriaValid = passwordRegex.test(passwordInput.value);
    const passwordsMatch = passwordInput.value === confirmPasswordInput.value;
    
    if (!isPwCriteriaValid) {
        // Passwort-Kriterien nicht erfüllt
        message.innerHTML = "Password requirements not met.";
        message.classList.add('show');
        confirmPasswordInput.classList.add('invalid');
    } else if (!passwordsMatch) {
        // Kriterien erfüllt, aber Passwörter stimmen nicht überein
        message.innerHTML = "Passwords does not match, please try again.";
        message.classList.add('show');
        passwordInput.classList.add('invalid');
        confirmPasswordInput.classList.add('invalid');
    } else {
        // Alles korrekt
        message.classList.remove('show');
        passwordInput.classList.remove('invalid');
        confirmPasswordInput.classList.remove('invalid');
    }
}

function validateName(name, input) {
    const message = document.querySelector('#name_message');
    const nameRegex = /^[a-zA-ZäöüÄÖÜß\s'-]{2,}$/;
    if (!message) return;
    if (name.trim() === '') {
        input.classList.remove('invalid');
        message.classList.remove('show');
        return;
    }
    if (nameRegex.test(name.trim())) {
        input.classList.remove('invalid');
        message.classList.remove('show');
    } else {
        input.classList.add('invalid');
        message.classList.add('show');
    }
}

function validateEmail(email, input) {
    const message = document.querySelector('#email_message');
    if (!message) return;
    if (email.trim() === '') {
        input.classList.remove('invalid');
        message.classList.remove('show');
        return;
    }
    if (mailRegex.test(email)) {
        input.classList.remove('invalid');
        message.classList.remove('show');
    } else {
        input.classList.add('invalid');
        message.classList.add('show');
    }
}

function validateLoginEmail(email, input) {
    const message = document.querySelector('.false_email');
    if (!message) return;
    if (email.trim() === '') {
        input.classList.remove('invalid');
        message.classList.remove('show');
        return;
    }
    if (mailRegex.test(email)) {
        input.classList.remove('invalid');
        message.classList.remove('show');
    } else {
        input.classList.add('invalid');
        message.classList.add('show');
    }
}

function recheckConfirmPassword() {
    const confirmPasswordInput = document.getElementById('signup-password-repeat');
    if (confirmPasswordInput && confirmPasswordInput.value !== '') {
        validateConfirmPassword(confirmPasswordInput.value, confirmPasswordInput);
        updatePasswordMessage();
    }
}

function validatePassword(password, input) {
    const message = document.querySelector('#password_message');
    if (!message) return;
    if (password === '') {
        input.classList.remove('invalid');
        message.classList.remove('show');
        recheckConfirmPassword();
        return;
    }
    if (passwordRegex.test(password)) {
        input.classList.remove('invalid');
        message.classList.remove('show');
    } else {
        input.classList.add('invalid');
        message.classList.add('show');
    }
    // Immer Confirm Password neu prüfen, wenn sich Password ändert
    recheckConfirmPassword();
}

function validateConfirmPassword(password, input) {
    // Diese Funktion ruft nur updatePasswordMessage auf
    updatePasswordMessage();
}

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

function validatePrivacyPolicy(checkbox) {
    const message = document.querySelector('#privacy_policy_message');
    if (!message) return;
    if (checkbox.checked) {
        message.classList.remove('show');
    } else {
        message.classList.add('show');
    }
}

window.validatePrivacyPolicy = validatePrivacyPolicy;




