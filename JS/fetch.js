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
    let response = await fetch("https://join-ad1a9-default-rtdb.europe-west1.firebasedatabase.app/.json");
    let data = await response.json();
    for (let key in data.users) {
        if (data.users[key]) {   
            contacts.push({
                id: key,
                root: 'users',
                ...data.users[key]});
        }
    }
    for (let key in data.contact) {
        if (data.contact[key]) {   
            contacts.push({
                id: key,
                root: 'contact',
                ...data.contact[key]});
        }
    }

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
    const last = parts[parts.length - 1][0];
    return (first + last);
}

function getPhonenumber(phone) {
    if (phone && phone.trim() !== "") {
        return phone;
    }   
    return "No phone number available";
}