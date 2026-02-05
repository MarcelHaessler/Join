/**
 * Handles Guest Mode initialization based on URL parameters or session storage.
 */

/**
 * Updates guest mode based on URL params
 * @returns {void}
 */
function setGuestModeFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('Guest')) {
        sessionStorage.setItem('guestMode', 'true');
    }
}

/**
 * Applies guest mode styling if guest mode is active
 * @returns {void}
 */
function applyGuestModeClass() {
    if (sessionStorage.getItem('guestMode') === 'true') {
        document.body.classList.add('mode-guest');
    }
}

/**
 * Initializes guest mode on DOM ready
 * @returns {void}
 */
function initGuestMode() {
    document.addEventListener('DOMContentLoaded', () => {
        setGuestModeFromUrl();
        applyGuestModeClass();
    });
}

initGuestMode();