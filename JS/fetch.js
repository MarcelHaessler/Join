let cachedHeader = null;
let cachedSidebar = null;
let contacts = [];

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
    let response = await fetch("https://join-ad1a9-default-rtdb.europe-west1.firebasedatabase.app/.json");
    let data = await response.json();
    for (let key in data.users) {
        if (data.users[key]) {   
            contacts.push(data.users[key]);
        }
    }
    for (let key in data.contact) {
        if (data.contact[key]) {   
            contacts.push(data.contact[key]);
        }
    }

    contacts.forEach((users, i) => {
    users.colorIndex = i % backgroundColorCodes.length;
    });

    console.log(contacts);
}