const contactList = document.getElementById("contacList");
const contactDetails = document.getElementById("contactSelectet");
const contactSidebarCss = document.querySelector('.sideBar');
const contactDetailsCss = document.querySelector('.contacts');
const dialogAddPerson = document.getElementById("dialogAddPerson");
const dialogEdit = document.getElementById("dialogEdit");
const mobileMenuTrigger = document.getElementById('mobileMenuTrigger'); 

window.addEventListener("load", () => {
  nameList();
});

// Fetch Contactlist and display them sorted by name with letter sections
async function nameList() {
    await fetchContacts();
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

// Show contact details on click
contactList.addEventListener("click", (event) => {
    const entry = event.target.closest(".contactEntry");
    if (!entry) return;

    const mail = entry.dataset.mail;
    const contact = contacts.find(c => c.email === mail);

    contactDetails.innerHTML = showContactDetails(contact);
    Detailsvisible();
});

// Mobile view: show sidebar and hide details
function sideBarvisible() {
    contactSidebarCss.classList.remove('hidden');
    contactDetailsCss.classList.remove('visible');
}

// Mobile view: show details and hide sidebar
function Detailsvisible() {
    const screenWidth = window.innerWidth;
    console.log('Neue Fensterbreite:', screenWidth);
    if (screenWidth <= 1100) {
        contactSidebarCss.classList.add('hidden');
        contactDetailsCss.classList.add('visible');
    } return
}

// Render letter section and contact entry
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



// function mobileEditBar() {
//     mobileEditeBar.classList.toggle('visible');
// }


// mobileMenuTrigger.addEventListener('click', (e) => {
//     e.stopPropagation(); 
//     mobileEditeBar.classList.toggle('visible');
// });


// document.addEventListener('click', (e) => {
//     const isClickInsideMenu = mobileEditeBar.contains(e.target);
//     const isClickOnTrigger = mobileMenuTrigger.contains(e.target);

//     if (!isClickInsideMenu && !isClickOnTrigger) {
//         mobileEditeBar.classList.remove('visible');
//     }
// });

// Add Dialog open
function openDialogAdd() {
  dialogAddPerson.showModal();
}

// Edit Dialog open
function openDialogEdit() {
  dialogEdit.showModal();
}

// Close all Dialog
function closeDialog() {
  dialogAddPerson.close();
  dialogEdit.close();
}

// Backdrop click Add to close Dialogs
dialogAddPerson.addEventListener("click", (event) => {
  if (event.target === dialogAddPerson) {
    closeDialog();
  }
});

// Backdrop click Edite to close Dialogs
dialogEdit.addEventListener("click", (event) => {
  if (event.target === dialogEdit) {
    closeDialog();
  }
});

// Open edit dialog on edit button click
document.addEventListener("click", (event) => {
    const button = event.target.closest("#editContactButton");
    if (!button) return;

    const mail = button.dataset.mail;
    const contact = contacts.find(c => c.email === mail);

    dialogEdit.innerHTML = editContact(contact);

    dialogEdit.showModal();
});

// Open edit dialog on edit button click
contactDetails.addEventListener('click', (e) => {
    const bar = document.getElementById('mobileEditeBar');
    if (!bar) return;
    if (e.target.closest('.sideBarOption')) {
        bar.classList.add('visible');
    } else {
        bar.classList.remove('visible');
        console.log('clicked outside');
    }
});

// Upload new contact to database
const BASE_URL = 'https://join-ad1a9-default-rtdb.europe-west1.firebasedatabase.app/';

// function CreateNewContact() {
//     const name = document.getElementById("contactAddName");
//     const email = document.getElementById("contactAddMail");
//     const phone = document.getElementById("contactAddPhone");
//     let NewContact = createContactObject(name, email, phone);
//     if 
// }

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', () => {
        if (input.type === 'name') {
            validateName(input.value, input);
        }
        if (input.type === 'email') {
            validateEmail(input.value, input);
        }
        if (input.type === 'phone') { 
            validatePassword(input.value, input)
        }
    });
});

function validateName(name, input) {
    if (name !== "") {
        input.classList.remove('invalid');
    } else {
        input.classList.add('invalid');
    }
}

async function uploadContact() {
    const name = document.getElementById("contactAddName");
    const email = document.getElementById("contactAddMail");
    const phone = document.getElementById("contactAddPhone");
    let NewContact = createContactObject(name, email, phone);

    await fetch(`${BASE_URL}/contact.json`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(NewContact)
    });
    console.log('Contact succesfully uploaded');
}

function createContactObject(nameInput, emailInput, phoneInput) {
    return {
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        createdAt: new Date().toISOString()
    };
}

// Render contact details
function showContactDetails(contact) {
    return `<div class="selectedIconName">
                <div class="selectetIcon" style="background-color: ${backgroundColorCodes[contact.colorIndex]};">
                    ${contact.initials}
                </div>
                <div class="selectedName">
                    ${contact.name}
                    <div class="selectedNameButtons">
                        <button id="editContactButton" data-mail="${contact.email}"><img src="./assets/img/contacts/edit.svg" alt="edit">Edit</button>
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
            </table>
            <div class="sideBarOption">
                <button onclick="mobileEditBar()"><img src="./assets/img/contacts/more_vert.svg" alt="mobile more option"></button>
            </div>
            <div id="mobileEditeBar">
                <button id="editContactButton" data-mail="${contact.email}"><img src="./assets/img/contacts/edit.svg" alt="">Edit</button>
                <button><img src="./assets/img/contacts/trash.svg" alt="">Delete</button>
            </div>`
}

// Render edit contact dialog
function editContact(contact) {
    return `<div>
                <div class="ACBetterTeam">
                    <img src="./assets/img/logo_light.svg" alt="">
                    <h2>Edit contact</h2>
                    <hr>
                </div>
                <div class="contactAdd">
                    <div class="ananymPerson">
                        <img src="./assets/img/contacts/person_white.svg" alt="">
                    </div>
                    <div class="contactAddForm">
                        <button class="cancel" onclick="closeDialog()"><img src="./assets/img/contacts/delete.svg" alt="" srcset=""></button>
                        <div>
                            <input type="text" id="contactAddName" name="contactName" value="${contact.name}">
                            <img class="inputIcon" src="./assets/img/contacts/person.svg" alt="" srcset="">
                        </div>
                        <div>
                            <input type="email" id="contactAddMail" name="contactMail" value="${contact.email}">
                            <img class="inputIcon" src="./assets/img/contacts/mail.svg" alt="" srcset="">
                        </div>
                        <div>
                            <input type="phone" id="contactAddPhone" name="contactPhone" value="${contact.phone}">
                            <img class="inputIcon" src="./assets/img/contacts/call.svg" alt="" srcset="">
                        </div>
                        <div class="contactEditButtons">
                            <button class="contactEditDelete" onclick="closeDialog()"><span>Delete</span></button>
                            <button class="contactEditSave"><span>Save</span><img class="contactAddButtonsImg" src="./assets/img/contacts/check.svg" alt="" srcset=""></button>
                        </div>
                    </div>
                </div>
            </div>`
}