
// Global variable to store the edited priority
editedPriority = '';

// Function to check and set the task priority in the edit task overlay
function checkTaskPriority(priority) {
    console.log('checkTaskPriority called with priority:', priority);
    if (priority === 'low') {
        lowPriority();  
    } else if (priority === 'medium') {
        mediumPriority();   
    } else if (priority === 'urgent') {
        urgentPriority();  
    }
}

// Functions to handle priority button states in the edit task overlay
function lowPriority() {
    resetPriorityButtons();
let editLowBtn = document.getElementById('edit-low-btn');
let editLowImg = document.getElementById('edit-low-img');    
    editLowBtn.style.backgroundColor = 'rgba(122, 226, 41, 1)';
    editLowBtn.style.color = 'white';
    editLowImg.src = './assets/img/add_task/low-active.svg'
    editedPriority = 'low';
    editUrgentBtnToNormal();
    editMediumBtnToNormal();
    console.log(editedPriority);
}

//medium priority function
function mediumPriority() {
    resetPriorityButtons();
let editMediumBtn = document.getElementById('edit-medium-btn');
let editMediumImg = document.getElementById('edit-medium-img'); 
    editMediumBtn.style.backgroundColor = 'rgba(255, 168, 0, 1)';
    editMediumBtn.style.color = 'white';
    editMediumImg.src = './assets/img/add_task/medium-active.svg'
    editedPriority = 'medium';
    editLowBtnToNormal();
    editUrgentBtnToNormal();
    console.log(editedPriority);
}

//urgent priority function
function urgentPriority() {
    resetPriorityButtons();
let editUrgentBtn = document.getElementById('edit-urgent-btn');
let editUrgentImg = document.getElementById('edit-urgent-img');
    editUrgentBtn.style.backgroundColor = 'rgba(255, 61, 0, 1)';
    editUrgentBtn.style.color = 'white';
    editUrgentImg.src = './assets/img/add_task/urgent-active.svg'
    editedPriority = 'urgent';
    editMediumBtnToNormal();
    editLowBtnToNormal();
    console.log(editedPriority);
}

// Function to reset all priority buttons to their default state
function resetPriorityButtons() {
    const priorities = [
        { id: 'urgent-btn', imgId: 'urgent-img', icon: 'urgent.svg' },
        { id: 'medium-btn', imgId: 'medium-img', icon: 'medium.svg' },
        { id: 'low-btn', imgId: 'low-img', icon: 'low.svg' }
    ];

    priorities.forEach(p => {
        const btn = document.getElementById(p.id);
        const img = document.getElementById(p.imgId);
        if (btn && img) {
            btn.style.backgroundColor = 'white';
            btn.style.color = 'black';
            img.src = `./assets/img/add_task/${p.icon}`;
            
            btn.classList.remove('no-hover');
            btn.style.cursor = 'pointer';
        }
    });
}

// Functions to reset individual edit priority buttons to normal state
function editUrgentBtnToNormal() {
let editUrgentBtn = document.getElementById('edit-urgent-btn');
let editUrgentImg = document.getElementById('edit-urgent-img');
    editUrgentBtn.disabled = false;
    editUrgentBtn.classList.remove('no-hover')
    editUrgentBtn.style.cursor = 'pointer';
    editUrgentBtn.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    editUrgentBtn.style.color = 'black';
    editUrgentImg.src = './assets/img/add_task/urgent.svg'
}

function editMediumBtnToNormal() {
    let editMediumBtn = document.getElementById('edit-medium-btn');
    let editMediumImg = document.getElementById('edit-medium-img');
    editMediumBtn.disabled = false;
    editMediumBtn.classList.remove('no-hover')
    editMediumBtn.style.cursor = 'pointer';
    editMediumBtn.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    editMediumBtn.style.color = 'black';
    editMediumImg.src = './assets/img/add_task/medium.svg'
}

function editLowBtnToNormal() {
    let editLowBtn = document.getElementById('edit-low-btn');
    let editLowImg = document.getElementById('edit-low-img');
    editLowBtn.disabled = false;
    editLowBtn.classList.remove('no-hover')
    editLowBtn.style.cursor = 'pointer';
    editLowBtn.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    editLowBtn.style.color = 'black';
    editLowImg.src = './assets/img/add_task/low.svg'
}

//Function to call all selected users for assignment in edit task
function getAssignedPersonsToEdit(task) {
    const assignedPersons = task.assignedPersons;
    let allContacts = allContacts
    console.log(allContacts);
    
}

function editAddInitialsBackgroundColors() {
    let contactInitials = document.querySelectorAll(".edit-contact-initials");

    contactInitials.forEach((initial, index) => {
        let contact = contacts[index];
        if (!contact) return;
        initial.style.backgroundColor = backgroundColorCodes[contact.colorIndex];
    });
}

function fillEditAssignmentDropdown() {
    let contactsDropdown = document.getElementById("edit-contacts-dropdown");
    contactsDropdown.innerHTML = "";

    for (let index = 0; index < contacts.length; index++) {
        let contactName = contacts[index].name;
        let contactInitials = contacts[index].name.charAt(0).toUpperCase() + contacts[index].name.charAt(contacts[index].name.indexOf(" ") + 1).toUpperCase();
        if (index === 0) {
            contactsDropdown.innerHTML += editAddSelfTemplate(contactName, contactInitials, index);
        } else {
            contactsDropdown.innerHTML += editAddTaskContactTemplate(contactName, contactInitials, index);
        }
        }
        console.log(contacts);
    
}

/**Function to render/open the assignment dropdown*/
function editRenderAssignmentDropdown() {
    let contactsDropdown = document.getElementById("edit-contacts-dropdown");
    contactsDropdown.classList.toggle("open");

    let arrowImage = document.getElementById("edit-assignment-arrow");
    arrowImage.classList.toggle("rotate");

    editAddInitialsBackgroundColors();
    editSearchContact();
}

/**Function that rotates the arrow on opening/closing the dropdown of assignment dropdown*/
document.addEventListener("click", function (e) {
    const assignmentInput = document.getElementById("edit-assign-input");
    const assignmentDropdown = document.getElementById("edit-contacts-dropdown");
    const assignmentArrow = document.querySelector("#edit-assign-input-box .dropdown-img-container");
    const assignmentArrowImg = document.getElementById("edit-assignment-arrow");

    if (!assignmentInput || !assignmentDropdown || !assignmentArrow || !assignmentArrowImg) return;

    if (!assignmentInput.contains(e.target) &&
        !assignmentDropdown.contains(e.target) &&
        !assignmentArrow.contains(e.target)) {
        assignmentDropdown.classList.remove("open");
        assignmentArrowImg.classList.remove("rotate");
    }
});

/**Function that adds a delay on searchContact function*/
function editDelaySearchContact() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => editSearchContact(), 500);
}

/**Function to search between the contacts and show them in assignment dropdown*/
function editSearchContact() {
    let assignInput = document.getElementById('edit-assign-input');
    let input = assignInput.value.toUpperCase();
    let contactElements = document.getElementById("edit-contacts-dropdown");
    let singleContacts = Array.from(contactElements.getElementsByClassName("edit-dropdown-box"));

    singleContacts.forEach(e => {
        const contactName = e.querySelector('.edit-contact-fullname');
        const txtValue = contactName.innerText || contactName.textContent;
        e.style.display = txtValue.toUpperCase().includes(input) ? "" : "none";
    })
}

/**Function to select contacts that will be added to the Task. */
function editSelectContact(index) {
    let currentContact = document.getElementById(`edit-contact${index}`);
    currentContact.classList.toggle('edit-selected-contact');

    let contact = contacts[index]
    let deleteContact = selectedContacts.find(c => c === contact);

    if (deleteContact) {
        selectedContacts = selectedContacts.filter(c => c !== contact);
    } else { selectedContacts.push(contact) };

    editRenderSelectedContacts();
    addChosenInitialsBackgroundColors();
    editChangeCheckbox(index);
}

/**Function to show the selected contacts. Only 3 contact initials will be rendered, from the 4th contact +(number of remaining contacts). */
function editRenderSelectedContacts() {
    let selectedContactsContainer = document.getElementById('edit-chosen-contacts');
    selectedContactsContainer.innerHTML = '';
    if (selectedContacts.length > 0) {
        selectedContactsContainer.classList.remove('d_none');
    } else { selectedContactsContainer.classList.add('d_none'); }
    for (let index = 0; index < selectedContacts.length; index++) {
        if (index <= 2) {
            let contactInitials = selectedContacts[index].name.charAt(0).toUpperCase()
                + selectedContacts[index].name.charAt(selectedContacts[index].name.indexOf(" ") + 1).toUpperCase();
            selectedContactsContainer.innerHTML += editAddInitialTemplate(contactInitials);
        }
    }
    if (selectedContacts.length > 3) {
        let number = selectedContacts.length - 3;
        selectedContactsContainer.innerHTML += addNumberOfExtraPeople(number);
    }
    editAddChosenInitialsBackgroundColors();
}

/**Function that adds background color to chosen contacts, same as before. */
function editAddChosenInitialsBackgroundColors() {
    let chosenContactInitials = document.querySelectorAll(".chosen-contact-initials");

    chosenContactInitials.forEach((initial, index) => {
        let contact = contacts[index];

        initial.style.backgroundColor = backgroundColorCodes[contact.colorIndex];
    });
}

/**Function that gives a checkbox user response by chosing a contact. */
function editChangeCheckbox(index) {
    let checkbox = document.getElementById(`edit-checkbox${index}`);
    if (!checkbox) return;

    const checkboxInactive = '../assets/img/checkbox_inactive.svg';
    const checkboxActive = '../assets/img/checkbox_active.svg';

    if (checkbox.src.includes('checkbox_inactive.svg')) {
        checkbox.src = checkboxActive;
        checkbox.classList.add('edit-checkbox-active');
    } else {
        checkbox.src = checkboxInactive;
        checkbox.classList.remove('edit-checkbox-active');
    }
}
