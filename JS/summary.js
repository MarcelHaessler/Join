


//greeting screen
function getGreetingTextByTime(date = new Date()) {
    const hour = date.getHours(); // local hour 0–23
    if (hour < 12) return "Good morning,";
    if (hour < 18) return "Good afternoon,";
    return "Good evening,";
}

function renderGreeting() {
    const el = document.getElementById("greeting-text");
    if (!el) return; // bail out if the element is missing
    el.textContent = getGreetingTextByTime();
}

// Read the current Firebase user and inject their name into the greeting.
const firebaseConfig = {
    apiKey: "AIzaSyDSu3EKowLDqtiFCKaMWTVDG_PB-cIA5t0",
    authDomain: "join-ad1a9.firebaseapp.com",
    projectId: "join-ad1a9",
    appId: "1:159410908442:web:d2c57cbf551ca660add0a3",
};

async function renderGreetingName() {
    const nameEl = document.getElementById("greet-name");
    if (!nameEl) return;

    try {
        const appModule = await import("https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js");
        const authModule = await import("https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js");

        let app;
        if (appModule.getApps().length > 0) {
            app = appModule.getApp();
        } else {
            app = appModule.initializeApp(firebaseConfig);
        }
        const auth = authModule.getAuth(app);

        authModule.onAuthStateChanged(auth, function (user) {
            if (user && user.displayName) {
                nameEl.textContent = user.displayName;
            } else {
                nameEl.textContent = "Guest";
            }
        });

    } catch (err) {
        console.error("Konnte Benutzername nicht laden:", err);
    }
}

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
    renderGreeting();
    renderGreetingName();
}
