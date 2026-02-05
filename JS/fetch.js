/**
 * Template and Contact Management Module
 * Handles HTML template fetching, contact data management, and UI initialization
 */

/** @type {string|null} Cached header HTML content */
let cachedHeader = null;

/** @type {string|null} Cached sidebar HTML content */
let cachedSidebar = null;

/** @type {Array<Object>} Global array of all contacts */
var contacts = [];

/** @type {Array<string>} Array of CSS color variable names for contact avatars */
var backgroundColorCodes = [
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

/**
 * Fetches and injects HTML templates for header and sidebar
 * Cache is disabled for immediate updates (using timestamp)
 * @async
 * @returns {Promise<void>}
 */
async function fetchHtmlTemplates() {
    // Cache deaktiviert für sofortige Updates
    const headerResp = await fetch('./assets/templates/header.html?v=' + Date.now());
    cachedHeader = await headerResp.text();
    localStorage.setItem('headerTemplate', cachedHeader);

    const sidebarResp = await fetch('./assets/templates/sideBar.html?v=' + Date.now());
    cachedSidebar = await sidebarResp.text();
    localStorage.setItem('sidebarTemplate', cachedSidebar);

    document.getElementById('header').innerHTML = cachedHeader;
    document.getElementById('side-bar').innerHTML = cachedSidebar;

    window.dispatchEvent(new Event('templatesLoaded'));

    highlightActiveWrapper();
    checkGuestMode();
}

/**
 * Checks if current page is a policy page and sets guest mode styling if no user is logged in
 * Only runs on privacy_policy.html and legal_notice.html pages
 * @returns {void}
 */
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

/**
 * Highlights the currently active page link in the sidebar navigation
 * Compares current URL path with link targets
 * @returns {void}
 */
function highlightActiveWrapper() {
    const current = window.location.pathname.split('/').pop();
    const wrappers = document.querySelectorAll('#side-bar .link-wrapper');

    wrappers.forEach((wrapper) => {
        const target = wrapper.getAttribute('href')?.split('/').pop();
        wrapper.classList.toggle('current-page', target === current);
    });
}

/**
 * Initializes the global loader overlay element
 * Creates the overlay DOM element if it doesn't exist
 * @returns {void}
 */
function initLoader() {
    if (!document.getElementById('global-loader-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'global-loader-overlay';
        overlay.classList.add('d_none');
        overlay.innerHTML = '<div class="loader-spinner"></div>';
        document.body.appendChild(overlay);
    }
}

/**
 * Shows the global loading spinner overlay
 * @returns {void}
 */
function showLoader() {
    const loader = document.getElementById('global-loader-overlay');
    if (loader) {
        loader.classList.remove('d_none');
    }
}

/**
 * Hides the global loading spinner overlay
 * @returns {void}
 */
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

/**
 * Initializes the mobile landscape orientation warning overlay
 * Creates the warning DOM element if it doesn't exist
 * @returns {void}
 */
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

/**
 * Fetches all contacts from Firebase and local storage
 * Processes and enhances contact data with colors and initials
 * @async
 * @returns {Promise<Array<Object>>} Array of all contacts
 */
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

/**
 * Processes contact data from both users and contacts snapshots
 * @param {Object} usersSnapshot - Firebase snapshot of users data
 * @param {Object} contactSnapshot - Firebase snapshot of contacts data
 * @returns {void}
 */
function processContactData(usersSnapshot, contactSnapshot) {
    processData(usersSnapshot, 'users');
    processData(contactSnapshot, 'contact');
}

/**
 * Fetches user and contact snapshots from Firebase
 * @async
 * @returns {Promise<Array>} Array with users snapshot and contacts snapshot
 * @throws {Error} If Firebase fetch fails
 */
async function fetchSnapshots() {
    const dbRef = db.ref();
    try {
        return await Promise.all([
            dbRef.child('users').get(),
            dbRef.child('contact').get()
        ]);
    } catch (error) {
        throw error;
    }
}

/**
 * Processes snapshot data and adds contacts to the global contacts array
 * @param {Object} snapshot - Firebase snapshot containing contact data
 * @param {string} root - The root type ('users' or 'contact')
 * @returns {void}
 */
function processData(snapshot, root) {
    if (snapshot.exists()) {
        const data = snapshot.val();
        for (let key in data) {
            contacts.push({ id: key, root: root, ...data[key] });
        }
    }
}

/**
 * Enhances contact data with color indices, initials, and formatted phone numbers
 * @returns {void}
 */
function enhanceContacts() {
    contacts.forEach((user, i) => {
        user.colorIndex = i % backgroundColorCodes.length;
        if (user.name && user.name.trim() !== "") {
            user.initials = getFirstAndLastInitial(user.name);
        } else {
            user.initials = "?";
        }
        user.phone = getPhonenumber(user.phone);
    });
}

/**
 * Extracts first and last initials from a full name
 * @param {string} fullName - The full name to extract initials from
 * @returns {string} Two-letter initials or "?" if name is empty
 */
function getFirstAndLastInitial(fullName) {
    if (!fullName || fullName.trim() === "") return "?";
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0][0];
    const last = parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] || "";
    return (first + last).toUpperCase();
}

/**
 * Gets phone number or returns default message if unavailable
 * @param {string} phone - The phone number to format
 * @returns {string} The phone number or default message
 */
function getPhonenumber(phone) {
    if (phone && phone.trim() !== "") {
        return phone;
    }
    return "No phone number available";
}