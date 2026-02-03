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
    else if (input.type === 'email') validateEmail(input.value, input);
    else if (input.placeholder === 'Password' && input.id !== 'login-password') validatePassword(input.value, input);
    else if (input.placeholder === 'Confirm Password') {
        validateConfirmPassword(input.value, input);
        updatePasswordMessage();
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
    if (!passwordInput || !confirmPasswordInput) return;
    if (passwordInput.value === '' || confirmPasswordInput.value === '') {
        false_password.classList.remove('show');
        return;
    }
    const passwordsMatch = passwordInput.value === confirmPasswordInput.value;
    const hasPasswordInvalid = passwordInput.classList.contains('invalid') || confirmPasswordInput.classList.contains('invalid');
    if (passwordsMatch || !hasPasswordInvalid) {
        false_password.classList.remove('show');
    } else {
        false_password.classList.add('show');
    }
}

function validateName(name, input) {
    const message = document.querySelector('#name_message');
    const nameRegex = /^[a-zA-ZäöüÄÖÜß\s'-]{2,}$/;
    if (!message) return;
    if (name.trim() === '') {
        input.classList.add('invalid');
        message.classList.add('show');
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
        input.classList.add('invalid');
        message.classList.add('show');
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
        input.classList.add('invalid');
        message.classList.add('show');
        recheckConfirmPassword();
        return;
    }
    if (passwordRegex.test(password)) {
        input.classList.remove('invalid');
        message.classList.remove('show');
        recheckConfirmPassword();
    } else {
        input.classList.add('invalid');
        message.classList.add('show');
    }
}

function validateConfirmPassword(password, input) {
    const passwordInput = document.getElementById("signup-password");
    const message = document.getElementById("password_repeat_message");
    if (!passwordInput || (passwordInput.value === '' && password === '')) {
        input.classList.remove('invalid');
        if (message) message.classList.remove('show');
        return;
    }
    if (password === '') {
        input.classList.add('invalid');
        if (message) message.classList.add('show');
        return;
    }
    const isMatch = passwordInput.value === password;
    input.classList.toggle('invalid', !isMatch);
    if (message) message.classList.toggle('show', !isMatch);
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




