let cachedHeader = null;
let cachedSidebar = null;

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



}