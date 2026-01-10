import { db } from "./firebaseSignInUp.js";
import { ref, get, child } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";

let cachedHeader = null;
let cachedSidebar = null;

window.contacts = [];
window.backgroundColorCodes = [
'var(--color1)', 'var(--color2)', 'var(--color3)', 'var(--color4)', 'var(--color5)', 
'var(--color6)', 'var(--color7)', 'var(--color8)', 'var(--color9)', 'var(--color10)', 
'var(--color11)', 'var(--color12)','var(--color13)', 'var(--color14)', 'var(--color15)'];

async function fetchHtmlTemplates() {
    if (!cachedHeader) {
        const resp = await fetch('./assets/templates/header.html');
        cachedHeader = await resp.text();
    }
    if (!cachedSidebar) {
        const resp = await fetch('./assets/templates/sideBar.html');
        cachedSidebar = await resp.text();
    }

    document.getElementById('header').innerHTML = cachedHeader;
    document.getElementById('side-bar').innerHTML = cachedSidebar;

    highlightActiveWrapper();
}

function highlightActiveWrapper() {
    const current = window.location.pathname.split('/').pop();
    const wrappers = document.querySelectorAll('#side-bar .link-wrapper');

    // Compare each link target with the current file and toggle highlighting.
    wrappers.forEach((wrapper) => {
        const target = wrapper.getAttribute('href')?.split('/').pop();
        wrapper.classList.toggle('current-page', target === current);
    });
}


async function fetchContacts() {
    window.contacts = [];
    const dbRef = ref(db);

    try {
        // Auth wird hier automatisch geprüft!
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
            const data = snapshot.val();

            // 1. Daten aus 'users' laden
            if (data.users) {
                for (let key in data.users) {
                    if (data.users[key]) {
                        window.contacts.push({
                            id: key,
                            root: 'users',
                            ...data.users[key]
                        });
                    }
                }
            }

            // 2. Daten aus 'contact' laden
            if (data.contact) {
                for (let key in data.contact) {
                    if (data.contact[key]) {
                        window.contacts.push({
                            id: key,
                            root: 'contact',
                            ...data.contact[key]
                        });
                    }
                }
            }
        } else {
            console.log("Keine Daten in der Datenbank gefunden.");
        }
    } catch (error) {
        console.error("Fehler beim Laden der Kontakte (Auth?):", error);
    }

    // Nachbearbeitung (Farben, Initialen)
    window.contacts.forEach((users, i) => {
        users.colorIndex = i % window.backgroundColorCodes.length;
        users.initials = getFirstAndLastInitial(users.name);
        users.phone = getPhonenumber(users.phone);
    });

    console.log("Geladene Kontakte:", window.contacts);
    return window.contacts;
}

function getFirstAndLastInitial(fullName) {
    if (!fullName) return "NN";
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0][0];
    const last = parts[parts.length - 1][0];
    return (first + last);
}

function getPhonenumber(phone) {
    if (phone && phone.trim() !== "") {
        return phone;
    }
    return "No phone number available";
}

window.fetchHtmlTemplates = fetchHtmlTemplates;
window.fetchContacts = fetchContacts;
window.getFirstAndLastInitial = getFirstAndLastInitial;
window.getPhonenumber = getPhonenumber;