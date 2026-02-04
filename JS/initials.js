window.addEventListener("userReady", (auth) => {
    let username = auth.detail.name;

    userInitials = username.charAt(0).toUpperCase() + username.charAt(username.indexOf(" ") + 1).toUpperCase();

    addInitialToHeader();
});

window.addEventListener("guestUser", (auth) => {
    let username = auth.detail.name;

    userInitials = username.charAt(0).toUpperCase();

    addInitialToHeader();
});

/**
 * Adds user initials to the header element
 * Retries if element not found yet
 * @returns {void}
 */
function addInitialToHeader() {
    let initialSpace = document.getElementById('user-initials');
    if (initialSpace) {
        initialSpace.innerHTML = userInitials;
        initLogoutDialog();
    } else {
        setTimeout(addInitialToHeader, 50);
    }
};

/**
 * Initializes the logout dialog with click handlers
 * @returns {void}
 */
function initLogoutDialog() {
    const dialogLogOut = document.getElementById("dialogLogOut");

    window.addEventListener("click", (e) => {
        if (e.target.closest("#user-icon")) {
            dialogLogOut.showModal();
        }
    });

    dialogLogOut.addEventListener("click", (e) => {
        if (e.target === dialogLogOut) dialogLogOut.close();
    });
}