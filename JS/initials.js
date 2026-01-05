window.addEventListener("userReady", (auth) => {
    let username = auth.detail.name;
    userInitials = username.charAt(0).toUpperCase() + username.charAt(username.indexOf(" ")+1).toUpperCase();
    addInitialToHeader();
});

function addInitialToHeader() {
    let initialSpace = document.getElementById('user-initials');
    initialSpace.innerHTML = userInitials; 
    console.log(userInitials);
};