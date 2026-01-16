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

    wrappers.forEach((wrapper) => {
        const target = wrapper.getAttribute('href')?.split('/').pop();
        wrapper.classList.toggle('current-page', target === current);
    });
}

async function fetchContacts() {
    contacts = [];
    const dbRef = ref(db);

    try {
        const [usersSnapshot, contactSnapshot] = await Promise.all([
            get(child(dbRef, 'users')),
            get(child(dbRef, 'contact'))
        ]);

        const usersData = usersSnapshot.exists() ? usersSnapshot.val() : {};
        const contactData = contactSnapshot.exists() ? contactSnapshot.val() : {};

        for (let key in usersData) {
            contacts.push({
                id: key,
                root: 'users',
                ...usersData[key]
            });
        }

        for (let key in contactData) {
            contacts.push({
                id: key,
                root: 'contact',
                ...contactData[key]
            });
        }

    } catch (error) {
        console.error("Error fetching contacts:", error);
    }

    contacts.forEach((users, i) => {
        users.colorIndex = i % backgroundColorCodes.length;
        users.initials = getFirstAndLastInitial(users.name);
        users.phone = getPhonenumber(users.phone);
    });
    contacts.forEach((users, i) => {
        users.colorIndex = i % backgroundColorCodes.length;
        users.initials = getFirstAndLastInitial(users.name);
        users.phone = getPhonenumber(users.phone);
    });
    return contacts;
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