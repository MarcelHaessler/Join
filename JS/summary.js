//greeting depends on time
function getGreetingTextByTime(date = new Date()) {
    const hour = date.getHours(); // local hour 0–23
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

//render greeting
function updateGreeting(name = "") {
    const greetEl = document.getElementById("greeting-text");
    const nameEl = document.getElementById("greet-name");

    if (!greetEl || !nameEl) return;

    const greeting = getGreetingTextByTime();

    if (name.trim() !== "") {
        greetEl.textContent = greeting + ",";
        nameEl.textContent = name;
    } else {
        greetEl.textContent = greeting + "!";
        nameEl.textContent = "";
    }
}

//eventListener
document.addEventListener("DOMContentLoaded", () => {
    updateGreeting("");
});

window.addEventListener("userReady", (auth) => {
    updateGreeting(auth.detail.name || "");
});

//hover imgs 
function pencilHoverEffect() {
    const img = document.querySelector('#to-do-container img');
    if (img) img.src = './assets/img/pencil-button-hover.svg';
}

function doneHoverEffect() {
    const img = document.querySelector('#done-container img');
    if (img) img.src = './assets/img/done-button-hover.svg';
}

function pencilLeaveEffect() {
    const img = document.querySelector('#to-do-container img');
    if (img) img.src = './assets/img/pencil-button.svg';
}

function doneLeaveEffect() {
    const img = document.querySelector('#done-container img');
    if (img) img.src = './assets/img/done-button.svg';
}



window.addEventListener("userReady", (auth) => {
    console.log("Name:", auth.detail.name, "Mail:", auth.detail.email);
});