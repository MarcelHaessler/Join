/**
 * Renders cached HTML templates for header and sidebar from local storage.
 * @returns {void}
 */
function renderCachedTemplates() {
    const cachedHeader = localStorage.getItem('headerTemplate');
    const cachedSidebar = localStorage.getItem('sidebarTemplate');

    if (cachedHeader) {
        const header = document.getElementById('header');
        if (header) header.innerHTML = cachedHeader;
    }

    if (cachedSidebar) {
        const sidebar = document.getElementById('side-bar');
        if (sidebar) sidebar.innerHTML = cachedSidebar;
    }
}

renderCachedTemplates();
