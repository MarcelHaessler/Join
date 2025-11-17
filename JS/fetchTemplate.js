const headerTemplate = document.getElementById('header');
const sideBarTemplate = document.getElementById('side-bar');

async function fetchHtmlTemplates() {

    const headerResponse = await fetch('./assets/templates/header.html');
    const headerHtml = await headerResponse.text();
    headerTemplate.innerHTML = headerHtml;

    const sideBarResponse = await fetch('./assets/templates/sideBar.html');
    const sideBarHtml = await sideBarResponse.text();
    sideBarTemplate.innerHTML = sideBarHtml;
}