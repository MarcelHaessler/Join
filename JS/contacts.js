
window.addEventListener("load", () => {
  nameList();
});

const contactList = document.getElementById("contacList");
const contactDetails = document.getElementById("contactSelectet");
const contactSidebarCss = document.querySelector('.sideBar');
const contactDetailsCss = document.querySelector('.contacts');

async function nameList() {
    await fetchContacts();
    console.log("Rendering contact list...");
    console.log(contacts);
    contacts.sort((a, b) => a.name.localeCompare(b.name, "de"));

    let currentLetter = "";

    contacts.forEach(contact => {
        const letter = contact.name[0].toUpperCase();
        if (letter !== currentLetter) {
            currentLetter = letter;
            contactList.innerHTML += letterSection(letter);
        }
        contactList.innerHTML += contactEntry(contact);
    });
}

contactList.addEventListener("click", (event) => {
    const entry = event.target.closest(".contactEntry");
    if (!entry) return;

    const mail = entry.dataset.mail;
    const contact = contacts.find(c => c.email === mail);

    contactDetails.innerHTML = showContactDetails(contact);

    Detailsvisible();
});


function sideBarvisible() {
    contactSidebarCss.classList.remove('hidden');
    contactDetailsCss.classList.remove('visible');

}

function Detailsvisible() {
    const screenWidth = window.innerWidth;
    console.log('Neue Fensterbreite:', screenWidth);
    if (screenWidth <= 1100) {
        contactSidebarCss.classList.add('hidden');
        contactDetailsCss.classList.add('visible');
    }
    return
}


function letterSection(letter) {
    return `<div class="sectionList">${letter}</div><hr>`
}

function contactEntry(contact) {
    return `<div class="contactEntry"  data-mail="${contact.email}">
                <div class="contactlistIcon" style="background-color: ${backgroundColorCodes[contact.colorIndex]};">
                    ${contact.initials}
                </div>
                <div class="contactDitails">
                    <div class="name">${contact.name}</div>
                    <div class="mail">${contact.email}</div>
                </div>
            </div>`
}

function showContactDetails(contact) {
    // selectetIcon.style.backgroundColor = backgroundColorCodes[contact.colorIndex];
    return `<div class="selectedIconName">
                <div class="selectetIcon" style="background-color: ${backgroundColorCodes[contact.colorIndex]};">
                    ${contact.initials}
                </div>
                <div class="selectedName">
                    ${contact.name}
                    <div class="selectedNameButtons">
                        <button><img src="./assets/img/contacts/edit.svg" alt="edit">Edit</button>
                        <button><img src="./assets/img/contacts/trash.svg" alt="delite">Delete</button>
                    </div>
                </div>    
            </div>
            <div class="contactInfos">
                Contact Information
            </div>
            <table>
                <tr>
                    <th>Email</th>
                </tr>
                <tr>
                    <td class="mail">${contact.email}</td>
                </tr>
                <tr>
                    <th>Phone</th>
                </tr>
                <tr>
                    <td>${contact.phone}</td>
                </tr>
            </table>`
}


function sideBarVisable() {
    
}

const mobileEditeBar = document.getElementById('mobileEditeBar');
const mobileMenuTrigger = document.getElementById('mobileMenuTrigger'); 


mobileMenuTrigger.addEventListener('click', (e) => {
    e.stopPropagation(); 
    mobileEditeBar.classList.toggle('visible');
});


document.addEventListener('click', (e) => {
    const isClickInsideMenu = mobileEditeBar.contains(e.target);
    const isClickOnTrigger = mobileMenuTrigger.contains(e.target);

    
    if (!isClickInsideMenu && !isClickOnTrigger) {
        mobileEditeBar.classList.remove('visible');
    }
});