/** @type {string} Stores the user initials globally */
let userInitials = "";

/**
 * Handles user ready event to set initials
 * @param {CustomEvent} auth - The auth event
 * @returns {void}
 */
function handleUserReady(auth) {
    let username = auth.detail.name;
    userInitials = getFormattedInitials(username);
    addInitialToHeader();
}

/**
 * Handles guest user event to set initials
 * @param {CustomEvent} auth - The auth event
 * @returns {void}
 */
function handleGuestUser(auth) {
    let username = auth.detail.name || "Guest";
    userInitials = username.charAt(0).toUpperCase();
    addInitialToHeader();
}

/**
 * Handles templates loaded event to re-apply initials
 * @returns {void}
 */
function handleTemplatesLoaded() {
    if (userInitials) {
        addInitialToHeader();
    }
}

/**
 * Initializes initials related event listeners
 * @returns {void}
 */
function initInitialsListeners() {
    window.addEventListener("userReady", handleUserReady);
    window.addEventListener("guestUser", handleGuestUser);
    window.addEventListener("templatesLoaded", handleTemplatesLoaded);
}

initInitialsListeners();

/**
 * Logic to extract initials from a full name.
 * @param {string} name 
 * @returns {string}
 */
function getFormattedInitials(name) {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    const first = parts[0] ? parts[0][0] : "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : (parts[0] ? parts[0][1] || "" : "");
    return (first + last).toUpperCase();
}

/**
 * Adds user initials to the header element.
 * @returns {void}
 */
function addInitialToHeader() {
    let initialSpace = document.getElementById('user-initials');
    if (initialSpace) {
        initialSpace.innerHTML = userInitials;
        initLogoutDialog();
    }
};

/**
 * Opens the logout dialog on user icon click
 * @param {HTMLElement} dialogLogOut - The logout dialog
 * @param {Event} e - The click event
 * @returns {void}
 */
function handleUserIconClick(dialogLogOut, e) {
    e.stopPropagation();
    dialogLogOut.showModal();
}

/**
 * Closes the logout dialog when clicking the backdrop
 * @param {HTMLElement} dialogLogOut - The logout dialog
 * @param {Event} e - The click event
 * @returns {void}
 */
function handleLogoutDialogClick(dialogLogOut, e) {
    if (e.target === dialogLogOut) dialogLogOut.close();
}

/**
 * Adds logout dialog listeners once
 * @param {HTMLElement} dialogLogOut - The logout dialog
 * @param {HTMLElement} userIcon - The user icon element
 * @returns {void}
 */
function addLogoutDialogListeners(dialogLogOut, userIcon) {
    userIcon.addEventListener('click', (e) => handleUserIconClick(dialogLogOut, e));
    dialogLogOut.addEventListener('click', (e) => handleLogoutDialogClick(dialogLogOut, e));
    userIcon.dataset.listenerAdded = "true";
}

/**
 * Initializes the logout dialog with click handlers.
 * @returns {void}
 */
function initLogoutDialog() {
    const dialogLogOut = document.getElementById("dialogLogOut");
    const userIcon = document.getElementById("user-icon");
    if (!dialogLogOut || !userIcon) return;
    if (userIcon.dataset.listenerAdded) return;
    addLogoutDialogListeners(dialogLogOut, userIcon);
}