const false_password = document.querySelector('.false_password');
const pw = document.getElementById("signup-password");
// Checkbox activation
function activateCheckbox() {
    const checkbox = document.getElementById("checkbox");
    if (checkbox.src.includes("checkbox_inactive.svg")){
        checkbox.src="./assets/img/checkbox_active.svg"
    }else{
        checkbox.src="./assets/img/checkbox_inactive.svg"
    }
}

const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^.{6,}$/;

// Input validation on blur and red border for invalid inputs
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', () => {
        if (input.placeholder === 'Name') {
            validateName(input.value, input);
        }
        if (input.type === 'email') {
            validateEmail(input.value, input);
        }
        if (input.placeholder === 'Password') { 
            validatePassword(input.value, input)
        }
        if (input.placeholder === 'Confirm Password') { 
            validateConfirmPassword(input.value, input)
        }
        const hasInvalid = document.querySelector('.invalid') !== null;
        if (hasInvalid) {
            false_password.classList.add('show');
        } else {
            false_password.classList.remove('show');
        }
    });
});

function validateName(name, input) {
    if (name !== "") {
        input.classList.remove('invalid');
    } else {
        input.classList.add('invalid');
    }
}

function validateEmail(email, input) {
    if (mailRegex.test(email)) {
        input.classList.remove('invalid');
    } else {
        input.classList.add('invalid');
    }
}

function validatePassword(password, input) {
    if (passwordRegex.test(password)) {
        input.classList.remove('invalid');
    } else {
        input.classList.add('invalid');
    }
}

function validateConfirmPassword(password, input) {
    console.log(pw.value);
    if (pw.value === password && password !== "") {
        input.classList.remove('invalid');
    } else {
        input.classList.add('invalid');
    }
}

// Password visibility toggle
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



window.addEventListener("userReady", (auth) => {
    console.log("Name:",auth.detail.name, "Mail:", auth.detail.email);
});
