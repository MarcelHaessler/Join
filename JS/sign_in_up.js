const false_password = document.querySelector('.false_password');


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
const passwordRegex = /^.{4,}$/;

// Input validation on blur and red border for invalid inputs
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', () => {
        if (input.type === 'email') {
            validateEmail(input.value, input);
        }
        if (input.placeholder === 'Password') { 
            validatePassword(input.value, input)
        }
    });
});

function validateEmail(email, input) {
    if (mailRegex.test(email)) {
        input.classList.remove('invalid');
        false_password.classList.remove('show');
    } else {
        input.classList.add('invalid');
        false_password.classList.add('show');
    }
}

function validatePassword(password, input) {
    if (passwordRegex.test(password)) {
        input.classList.remove('invalid');
        false_password.classList.remove('show');
    } else {
        input.classList.add('invalid');
        false_password.classList.add('show');
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

