let cachedHeader = null;
let cachedSidebar = null;
window.contacts = [];
window.backgroundColorCodes = [
    'var(--color1)',
    'var(--color2)',
    'var(--color3)',
    'var(--color4)',
    'var(--color5)',
    'var(--color6)',
    'var(--color7)',
    'var(--color8)',
    'var(--color9)',
    'var(--color10)',
    'var(--color11)',
    'var(--color12)',
    'var(--color13)',
    'var(--color14)',
    'var(--color15)'];

import { db } from "./firebaseAuth.js";
import { ref, get, child } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";

async function fetchHtmlTemplates() {
    // Cache deaktiviert für sofortige Updates
    const headerResp = await fetch('./assets/templates/header.html?v=' + Date.now());
    cachedHeader = await headerResp.text();

    const sidebarResp = await fetch('./assets/templates/sideBar.html?v=' + Date.now());
    cachedSidebar = await sidebarResp.text();

    document.getElementById('header').innerHTML = cachedHeader;
    document.getElementById('side-bar').innerHTML = cachedSidebar;

    highlightActiveWrapper();
    checkGuestMode();
}

function checkGuestMode() {
    const isPolicyPage = window.location.pathname.includes('privacy_policy.html');
    const isLegalPage = window.location.pathname.includes('legal_notice.html');

    // Nur auf Privacy Policy und Legal Notice Seiten prüfen
    if (isPolicyPage || isLegalPage) {
        const currentUser = localStorage.getItem('join_current_user');
        document.body.classList.remove('loading-auth');

        if (!currentUser) {
            // Kein eingeloggter Benutzer -> setze mode-guest
            document.body.classList.add('mode-guest');
        }
    }
}

function highlightActiveWrapper() {
    const current = window.location.pathname.split('/').pop();
    const wrappers = document.querySelectorAll('#side-bar .link-wrapper');

    wrappers.forEach((wrapper) => {
        const target = wrapper.getAttribute('href')?.split('/').pop();
        wrapper.classList.toggle('current-page', target === current);
    });
}

function initLoader() {
    if (!document.getElementById('global-loader-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'global-loader-overlay';
        overlay.classList.add('d_none');
        overlay.innerHTML = '<div class="loader-spinner"></div>';
        document.body.appendChild(overlay);
    }
}

function showLoader() {
    const loader = document.getElementById('global-loader-overlay');
    if (loader) {
        loader.classList.remove('d_none');
    }
}

function hideLoader() {
    const loader = document.getElementById('global-loader-overlay');
    if (loader) {
        loader.classList.add('d_none');
    }
}

window.showLoader = showLoader;
window.hideLoader = hideLoader;
initLoader();
initOrientationWarning();
fetchHtmlTemplates();

function initOrientationWarning() {
    if (!document.getElementById('mobile-landscape-warning')) {
        const warning = document.createElement('div');
        warning.id = 'mobile-landscape-warning';
        warning.classList.add('d_none');
        warning.innerHTML = `
            <div class="landscape-content">
                <span class="rotate-device-icon">↻</span>
                <p>Please rotate your device</p>
            </div>
        `;
        document.body.appendChild(warning);
    }
}

async function fetchContacts() {
    showLoader();
    contacts = [];
    try {
        const [usersSnapshot, contactSnapshot] = await fetchSnapshots();
        processContactData(usersSnapshot, contactSnapshot);
        enhanceContacts();
    } catch (error) {
        // Silent error handling
    } finally {
        hideLoader();
    }
    return contacts;
}

function processContactData(usersSnapshot, contactSnapshot) {
    processData(usersSnapshot, 'users');
    processData(contactSnapshot, 'contact');
}

async function fetchSnapshots() {
    const dbRef = ref(db);
    try {
        return await Promise.all([
            get(child(dbRef, 'users')),
            get(child(dbRef, 'contact'))
        ]);
    } catch (error) {
        throw error;
    }
}

function processData(snapshot, root) {
    if (snapshot.exists()) {
        const data = snapshot.val();
        for (let key in data) {
            contacts.push({ id: key, root: root, ...data[key] });
        }
    }
}

function enhanceContacts() {
    contacts.forEach((user, i) => {
        user.colorIndex = i % backgroundColorCodes.length;
        user.initials = getFirstAndLastInitial(user.name);
        user.phone = getPhonenumber(user.phone);
    });
}

function getFirstAndLastInitial(fullName) {
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0][0];
    const last = parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] || "";
    return (first + last).toUpperCase();
}

function getPhonenumber(phone) {
    if (phone && phone.trim() !== "") {
        return phone;
    }
    return "No phone number available";
}

window.fetchHtmlTemplates = fetchHtmlTemplates;
window.fetchContacts = fetchContacts;