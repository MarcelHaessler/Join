/** @type {string} Stores the user initials globally */
let userInitials = "";

window.addEventListener("userReady", (auth) => {
    let username = auth.detail.name;
    userInitials = getFormattedInitials(username);
    addInitialToHeader();
});

window.addEventListener("guestUser", (auth) => {
    let username = auth.detail.name || "Guest";
    userInitials = username.charAt(0).toUpperCase();
    addInitialToHeader();
});

/**
 * Re-applies initials whenever templates are freshly loaded into the DOM.
 * This prevents initials from being overwritten by the default "G" in the template.
 */
window.addEventListener("templatesLoaded", () => {
    if (userInitials) {
        addInitialToHeader();
    }
});

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
 * Initializes the logout dialog with click handlers.
 * @returns {void}
 */
function initLogoutDialog() {
    const dialogLogOut = document.getElementById("dialogLogOut");
    const userIcon = document.getElementById("user-icon");
    if (!dialogLogOut || !userIcon) return;

    if (!userIcon.onclick) {
        userIcon.onclick = () => dialogLogOut.showModal();
    }

    if (!dialogLogOut.onclick) {
        dialogLogOut.onclick = (e) => {
            if (e.target === dialogLogOut) dialogLogOut.close();
        };
    }
}