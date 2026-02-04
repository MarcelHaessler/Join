/**
 * Gets greeting text based on time of day
 * @param {Date} [date=new Date()] - The date to check (defaults to current)
 * @returns {string} Greeting message ("Good morning", "Good afternoon", or "Good evening")
 */
function getGreetingTextByTime(date = new Date()) {
    const hour = date.getHours(); // local hour 0–23
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

/**
 * Updates the greeting display with time-based message and user name
 * @param {string} [name=""] - The user's name to display
 * @returns {void}
 */
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
 * Finishes the mobile greeting animation and transitions to main content
 * @returns {void}
 */
function finishMobileGreeting() {
    if (!document.body.classList.contains('show-greeting')) return;

    setTimeout(() => {
        const greeting = document.getElementById('greeting-section');
        const main = document.querySelector('main');

        if (greeting) greeting.classList.add('hide-animation');
        if (main) main.classList.add('animate');

        sessionStorage.removeItem('showSummaryGreeting');

        setTimeout(() => {
            document.body.classList.remove('show-greeting');
        }, 2100);
    });
}

// Funktionen sind automatisch global

addEventListener("userReady", (auth) => {
    updateGreeting(auth.detail.name || "");
});

/**
 * Changes pencil icon to hover state
 * @returns {void}
 */
function pencilHoverEffect() {
    const img = document.querySelector('#to-do-container img');
    if (img) img.src = './assets/img/pencil-button-hover.svg';
}

/**
 * Changes done icon to hover state
 * @returns {void}
 */
function doneHoverEffect() {
    const img = document.querySelector('#done-container img');
    if (img) img.src = './assets/img/done-button-hover.svg';
}

/**
 * Restores pencil icon to normal state
 * @returns {void}
 */
function pencilLeaveEffect() {
    const img = document.querySelector('#to-do-container img');
    if (img) img.src = './assets/img/pencil-button.svg';
}

/**
 * Restores done icon to normal state
 * @returns {void}
 */
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