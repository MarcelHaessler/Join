function activateCheckbox() {
    const checkbox = document.getElementById("checkbox");
    if (checkbox.src.includes("checkbox_inactive.svg")){
        checkbox.src="./assets/img/checkbox_active.svg"
    }else{
        checkbox.src="./assets/img/checkbox_inactive.svg"
    }
}

function hoverBackButton() {
    const backButton = document.getElementById("back_button");
    backButton.src="./assets/img/back_button_active.svg"
}
function unhoverBackButton() {
    const backButton = document.getElementById("back_button");
    backButton.src="./assets/img/back_button_inactive.svg"
}

window.onload = () => {
    document.body.classList.add('loaded');
};
const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^.{4,}$/;

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', () => {
        if (input.type === 'email') {
            validateEmail(input.value, input);
        }
        if (input.type === 'password') { 
            validatePassword(input.value, input)
        }
    });
});

function validateEmail(email, input) {
    if (mailRegex.test(email)) {
        console.log('Mail');
        input.classList.remove('invalid');
    } else {
        console.log('no Mail');
        input.classList.add('invalid');
    }
}

function validatePassword(password, input) {
    if (passwordRegex.test(password)) {
        console.log('passwort');
        input.classList.remove('invalid');
    } else {
        console.log('no passwort');
        input.classList.add('invalid');
    }
}



const BaseUrl = 'https://join-ad1a9-default-rtdb.europe-west1.firebasedatabase.app/';

async function loadData() {
    let response = await fetch(BaseUrl + '.json');
    let data = await response.json();
    console.log(data);
}

async function sendData() {
    const data = { "email": "test@example.com", "pw": "1234" };

    let response = await fetch(BaseUrl + '/Login.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}
