

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

// call once on load, or whenever you need to refresh the greeting
function renderAll(){
    fetchHtmlTemplates();
    renderGreeting();
}
