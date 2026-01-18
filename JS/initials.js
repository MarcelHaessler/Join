window.addEventListener("userReady", (auth) => {
    let username = auth.detail.name;
    userInitials = username.charAt(0).toUpperCase() + username.charAt(username.indexOf(" ") + 1).toUpperCase();
    addInitialToHeader();
});

function addInitialToHeader() {
    let initialSpace = document.getElementById('user-initials');
    initialSpace.innerHTML = userInitials;
    console.log(userInitials);
    initLogoutDialog();
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