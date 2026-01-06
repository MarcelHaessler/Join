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
    const nameEl  = document.getElementById("greet-name");

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



// onload
function renderAll() {
    fetchHtmlTemplates();
}


window.addEventListener("userReady", (auth) => {
    console.log("Name:",auth.detail.name, "Mail:", auth.detail.email);
    // Username bzw. displayName -> auth.detail.name
    // Usermail -> auth.detail.email
});

// ===== Greeting overlay (mobile only, once per session) =====
(function greetingOverlayOnce() {
    const KEY = 'join_summary_greeting_shown';

    window.addEventListener('load', () => {
        // Only run on small screens
        if (!window.matchMedia('(max-width: 1100px)').matches) return;

        // Show only once per tab/session
        if (sessionStorage.getItem(KEY) === '1') return;
        sessionStorage.setItem(KEY, '1');

        const greeting = document.getElementById('greeting-section');
        if (!greeting) return;

        document.body.classList.add('show-greeting');

        // After the CSS animation ends, hide again
        const cleanup = () => {
            greeting.removeEventListener('animationend', cleanup);
            document.body.classList.remove('show-greeting');
        };

        greeting.addEventListener('animationend', cleanup);
    });
})();
