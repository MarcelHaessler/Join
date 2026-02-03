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

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', () => {
        if (input.placeholder === 'Name') {validateName(input.value, input);} 
        else if (input.type === 'email') {validateEmail(input.value, input);} 
        else if (input.placeholder === 'Password' && input.id !== 'login-password') {validatePassword(input.value, input);} 
        else if (input.placeholder === 'Confirm Password') {
            validateConfirmPassword(input.value, input);
            updatePasswordMessage();
        }
    });
    if (input.placeholder === 'Password' && input.id !== 'login-password') {
        input.addEventListener('input', () => {
            validatePassword(input.value, input);
        });
    }
    if (input.placeholder === 'Confirm Password') {
        input.addEventListener('input', () => {
            validateConfirmPassword(input.value, input);
            updatePasswordMessage();
        });
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
    
    if (passwordsMatch) {
        false_password.classList.remove('show');
    } else {
        const hasPasswordInvalid = passwordInput.classList.contains('invalid') || 
                                    confirmPasswordInput.classList.contains('invalid');
        if (hasPasswordInvalid) {
            false_password.classList.add('show');
        } else {
            false_password.classList.remove('show');
        }
    }
}

function validateName(name, input) {
    const message = document.querySelector('#name_message');

    if (!message) return;

    if (name !== "") {
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

    if (mailRegex.test(email)) {
        input.classList.remove('invalid');
        message.classList.remove('show');
    } else {
        input.classList.add('invalid');
        message.classList.add('show');
    }
}

function validatePassword(password, input) {
    const message = document.querySelector('#password_message');
    const confirmPasswordInput = document.getElementById('signup-password-repeat');

    if (!message) return;

    if (passwordRegex.test(password)) {
        input.classList.remove('invalid');
        message.classList.remove('show');
        if (confirmPasswordInput && confirmPasswordInput.value !== '') {
            validateConfirmPassword(confirmPasswordInput.value, confirmPasswordInput);
            updatePasswordMessage();
        }
    } else {
        input.classList.add('invalid');
        message.classList.add('show');
    }
}

function validateConfirmPassword(password, input) {
    const passwordInput = document.getElementById("signup-password");
    const message = document.getElementById("password_repeat_message");
    
    if (!passwordInput || passwordInput.value === '') {
        input.classList.remove('invalid');
        if (message) {
            message.classList.remove('show');
        }
        return;
    }
    
    if (passwordInput.value === password) {
        input.classList.remove('invalid');
        if (message) {
            message.classList.remove('show');
        }
    } else {
        input.classList.add('invalid');
        if (message) {
            message.classList.add('show');
        }
    }
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




