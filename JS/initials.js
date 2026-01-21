window.addEventListener("userReady", (auth) => {
    let username = auth.detail.name;
    userInitials = username.charAt(0).toUpperCase() + username.charAt(username.indexOf(" ") + 1).toUpperCase();
    addInitialToHeader();
});

function addInitialToHeader() {
    let initialSpace = document.getElementById('user-initials');
    if (initialSpace) {
        initialSpace.innerHTML = userInitials;
        console.log(userInitials);
        initLogoutDialog();
    } else {
        console.warn("Header initials container not found, retrying...");
        setTimeout(addInitialToHeader, 50);
    }
};

function initLogoutDialog() {
    const dialogLogOut = document.getElementById("dialogLogOut");

    window.addEventListener("click", (e) => {
        if (e.target.closest("#user-icon")) {
            console.log("open dialog");
            dialogLogOut.showModal();
        }
    });

    dialogLogOut.addEventListener("click", (e) => {
        if (e.target === dialogLogOut) dialogLogOut.close();
    });
}