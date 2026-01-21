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
    initMobileGreeting();
});

/**
 * Handles the mobile-only greeting intro animation setup.
 * Returns true if the greeting is being displayed.
 */
function initMobileGreeting() {
    const isMobile = window.innerWidth <= 1100;
    const shouldShow = sessionStorage.getItem('showSummaryGreeting') === 'true';

    if (isMobile && shouldShow) {
        document.body.classList.add('show-greeting');
        return true;
    }
    return false;
}

/**
 * Triggers the actual fade-out transition of the greeting and fade-in of content.
 * Should be called when data loading is finished.
 */
function finishMobileGreeting() {
    if (!document.body.classList.contains('show-greeting')) return;

    const greeting = document.getElementById('greeting-section');
    const main = document.querySelector('main');

    if (greeting) greeting.classList.add('hide-animation');
    if (main) main.classList.add('animate');

    sessionStorage.removeItem('showSummaryGreeting');

    // Remove the whole class after the fade animation is done (1s duration in CSS)
    setTimeout(() => {
        document.body.classList.remove('show-greeting');
    }, 1100);
}

window.initMobileGreeting = initMobileGreeting;
window.finishMobileGreeting = finishMobileGreeting;

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

// Greeting overlay trigger (mobile only, once per session)
(function greetingOverlayOnce() {
    const KEY = 'join_summary_greeting_shown';

    window.addEventListener('load', () => {
        // Only run on small screens
        if (!window.matchMedia('(max-width: 1100px)').matches) return;

        const greeting = document.getElementById('greeting-section');
        if (!greeting) return;

        // Show only once per tab/session
        if (sessionStorage.getItem(KEY) === '1') return;
        sessionStorage.setItem(KEY, '1');

        document.body.classList.add('show-greeting');

        // Remove class after CSS animation completes
        const cleanup = () => {
            greeting.removeEventListener('animationend', cleanup);
            document.body.classList.remove('show-greeting');
        };

        greeting.addEventListener('animationend', cleanup);
    });
})();