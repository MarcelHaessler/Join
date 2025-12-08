let userInitials = '';
let username = ''
window.addEventListener("userReady",async (auth) => {
    console.log("Name:",auth.detail.name, "Mail:", auth.detail.email);
    username = auth.detail.name
    await fetchContacts();
    putSelfOnFirstPlace(username);
    console.log(username);
    userInitials = username.charAt(0).toUpperCase() + username.charAt(username.indexOf(" ")+1).toUpperCase()
    addInitialToHeader();
    fillAssignmentDropdown();
});

function addInitialToHeader() {
    let initialSpace = document.getElementById('user-initials');
    initialSpace.innerHTML = userInitials; 
    console.log(userInitials);
}

function putSelfOnFirstPlace(username) {
   let array = contacts.findIndex(e => e.name == username);
   if (array !== -1) contacts.unshift(...contacts.splice(array, 1));
   console.log(contacts);
   
}