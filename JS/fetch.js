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

import { auth, db } from "./firebaseAuth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { ref, get, child } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";

async function fetchHtmlTemplates() {
    cachedHeader = localStorage.getItem('headerTemplate');
    cachedSidebar = localStorage.getItem('sidebarTemplate');

    if (!cachedHeader) {
        const resp = await fetch('./assets/templates/header.html');
        cachedHeader = await resp.text();
        localStorage.setItem('headerTemplate', cachedHeader);
    }
    if (!cachedSidebar) {
        const resp = await fetch('./assets/templates/sideBar.html');
        cachedSidebar = await resp.text();
        localStorage.setItem('sidebarTemplate', cachedSidebar);
    }

    document.getElementById('header').innerHTML = cachedHeader;
    document.getElementById('side-bar').innerHTML = cachedSidebar;

    highlightActiveWrapper();
    checkGuestMode();
}

function checkGuestMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const isGuestParam = urlParams.has('Guest') || urlParams.get('guest') === 'true';
    const isPolicyPage = window.location.pathname.includes('privacy_policy.html');
    const isLegalPage = window.location.pathname.includes('legal_notice.html');

    if (isGuestParam) {
        sessionStorage.setItem('guestMode', 'true');
    }

    const sessionGuest = sessionStorage.getItem('guestMode');

    if ((isPolicyPage || isLegalPage) && sessionGuest === 'true') {
        document.body.classList.add('mode-guest');
    } else if (isPolicyPage || isLegalPage) {
        document.body.classList.remove('mode-guest');
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
        processData(usersSnapshot, 'users');
        processData(contactSnapshot, 'contact');
        enhanceContacts();
    } catch (error) {
    } finally {
        hideLoader();
    }
    return contacts;
}

async function fetchSnapshots() {
    const dbRef = ref(db);
    return await Promise.all([
        get(child(dbRef, 'users')),
        get(child(dbRef, 'contact'))
    ]);
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