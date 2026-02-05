/**
 * Handles Guest Mode initialization based on URL parameters or session storage.
 */

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);

    // Check URL parameter 'Guest'
    if (urlParams.has('Guest')) {
        sessionStorage.setItem('guestMode', 'true');
    }

    // Apply guest mode class if active
    if (sessionStorage.getItem('guestMode') === 'true') {
        document.body.classList.add('mode-guest');
    }
});