


//greeting screen
function getGreetingTextByTime(date = new Date()) {
    const hour = date.getHours(); // local hour 0–23
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

// greet without name
document.addEventListener("DOMContentLoaded", () => {
    const greetEl = document.getElementById("greeting-text");
    if (greetEl) {
        greetEl.textContent = getGreetingTextByTime();
    }
});
// add name and greet
window.addEventListener("userReady", (auth) => {
    let nameEl = document.getElementById('greet-name');
    nameEl.textContent = auth.detail.name;
    if (nameEl && nameEl.textContent.trim() !== "") {
        const greetEl = document.getElementById("greeting-text");
        greetEl.textContent = getGreetingTextByTime() + ",";
    }
    else {
        const greetEl = document.getElementById("greeting-text");
        greetEl.textContent = getGreetingTextByTime()
    }
}
);


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



// onload
function renderAll() {
    fetchHtmlTemplates();
}
