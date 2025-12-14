let contacts = [];
/**Put all Background colors in the array after style.css has been Updated. */
let backgroundColorCodes = [
'var(--color1)',
'var(--color2)',
'var(--color3)',
'var(--color4)',
'var(--color5)',
'var(--color6)',
'var(--color7)',
'var(--color8)',
'var(--color9)',
'var(--color10)',
'var(--color11)',
'var(--color12)',
'var(--color13)',
'var(--color14)',
'var(--color15)'];
let searchTimeout;
let selectedContacts =[];
let currentCategory = "";
let subtaskIndex = 0;
let subtaskListArray;

/**Function that fetches all contacts and stores them in contacts array.*/
async function fetchContacts() {
    let response = await fetch("https://join-ad1a9-default-rtdb.europe-west1.firebasedatabase.app/.json");
    let data = await response.json();
    for (let key in data.users) {
        if (data.users[key]) {   
            contacts.push(data.users[key]);
        }
    }
    for (let key in data.contact) {
        if (data.contact[key]) {   
            contacts.push(data.contact[key]);
        }
    }

    contacts.forEach((users, i) => {
    users.colorIndex = i % backgroundColorCodes.length;
    });

    console.log(contacts);
}
/**This function adds the defined colors in backgroundColorCodes array to user initials*/
function addInitialsBackgroundColors() {
    let contactInitials = document.querySelectorAll(".contact-initials");

    contactInitials.forEach((initial, index) => {
        let contact = contacts[index];
 
        initial.style.backgroundColor = backgroundColorCodes[contact.colorIndex];
    });
}

/**Function to fill the dropdown with all the contacts in contacts array*/
function fillAssignmentDropdown() {
    let contactsDropdown = document.getElementById("contacts-dropdown");
    contactsDropdown.innerHTML = "";

    for (let index = 0; index < contacts.length; index++) {
    let contactName = contacts[index].name;
    let contactInitials = contacts[index].name.charAt(0).toUpperCase() + contacts[index].name.charAt(contacts[index].name.indexOf(" ") + 1).toUpperCase();
    if (index === 0) {
        contactsDropdown.innerHTML += addSelfTemplate(contactName, contactInitials, index);
    }else{
        contactsDropdown.innerHTML += addTaskContactTemplate(contactName, contactInitials, index);
    }
    }
}

/**Function to render/open the assignment dropdown*/
function renderAssignmentDropdown() {
    let contactsDropdown = document.getElementById("contacts-dropdown");
    contactsDropdown.classList.toggle("open");

    let arrowImage = document.getElementById("assignment-arrow");
    arrowImage.classList.toggle("rotate");

    addInitialsBackgroundColors();
    searchContact();
}

/**Function that rotates the arrow on opening/closing the dropdown of assignment dropdown*/
document.addEventListener("click", function(e){
    const assignmentInput = document.getElementById("assign-input");
    const assignmentDropdown = document.getElementById("contacts-dropdown");
    const assignmentArrow = document.querySelector("#assign-input-box .dropdown-img-container");
    const assignmentArrowImg = document.getElementById("assignment-arrow");

    if (!assignmentInput.contains(e.target) &&
        !assignmentDropdown.contains(e.target) &&
        !assignmentArrow.contains(e.target)) {
        assignmentDropdown.classList.remove("open");
        assignmentArrowImg.classList.remove("rotate");
    }
});

/**Function that adds a delay on searchContact function*/
function delaySearchContact() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => searchContact(), 500);
}

/**Function to search between the contacts and show them in assignment dropdown*/
function searchContact(){
    let assignInput = document.getElementById('assign-input');
    let input = assignInput.value.toUpperCase();
    let contactElements = document.getElementById("contacts-dropdown");   
    let singleContacts = Array.from(contactElements.getElementsByClassName("dropdown-box"));

    singleContacts.forEach(e => {
        const contactName = e.querySelector('.contact-fullname');   
        const txtValue = contactName.innerText || contactName.textContent;
        e.style.display = txtValue.toUpperCase().includes(input) ? "" : "none";
    })
}

/**Function to select contacts that will be added to the Task. */
function selectContact(index) {
    let currentContact = document.getElementById(`contact${index}`);
    currentContact.classList.toggle('selected-contact');
    
    let contact = contacts[index]
    let deleteContact = selectedContacts.find(c => c === contact);
    console.log(deleteContact);

    if (deleteContact) {
        selectedContacts = selectedContacts.filter(c => c !== contact);
    } else {selectedContacts.push(contact)};

    console.log(selectedContacts);
    renderSelectedContacts();
    addChosenInitialsBackgroundColors();
    changeCheckbox(index);
}

/**Function to show the selected contacts. Only 3 contact initials will be rendered, from the 4th contact +(number of remaining contacts). */
function renderSelectedContacts() {
    let selectedContactsContainer = document.getElementById('chosen-contacts');
    selectedContactsContainer.innerHTML = '';
    if (selectedContacts.length > 0) {
        selectedContactsContainer.classList.remove('d_none');
    } else { selectedContactsContainer.classList.add('d_none'); }
    for (let index = 0; index < selectedContacts.length; index++) {
        if (index <= 2) {
            let contactInitials = selectedContacts[index].name.charAt(0).toUpperCase() 
            + selectedContacts[index].name.charAt(selectedContacts[index].name.indexOf(" ") + 1).toUpperCase();
            selectedContactsContainer.innerHTML += addInitialTemplate(contactInitials);
        }
    }
    if (selectedContacts.length > 3) {
        let number = selectedContacts.length - 3;
        selectedContactsContainer.innerHTML += addNumberOfExtraPeople(number);
    }
    addChosenInitialsBackgroundColors();
}

/**Function that adds background color to chosen contacts, same as before. */
function addChosenInitialsBackgroundColors() {
    let chosenContactInitials = document.querySelectorAll(".chosen-contact-initials");

    chosenContactInitials.forEach((initial, index) => {
        let contact = contacts[index];
 
        initial.style.backgroundColor = backgroundColorCodes[contact.colorIndex];
    });
}

/**Function that gives a checkbox user response by chosing a contact. */
function changeCheckbox(index) {
    let checkbox = document.getElementById(`checkbox${index}`);
    const checkboxInactive = './assets/img/checkbox_inactive.svg';
    const checkboxActive = './assets/img/checkbox_active.svg'

    if (checkbox.src.includes('checkbox_inactive.svg')) {
        checkbox.src = checkboxActive
        checkbox.classList.add('checkbox-active');
    } else {
        checkbox.src = checkboxInactive
        checkbox.classList.remove('checkbox-active');
    }
}

/**Function to open category dropdown */
function openCloseCategoryDropdown() {
    let categoryDropdown = document.getElementById("category-dropdown");
    let arrowImage = document.getElementById("category-arrow");
    arrowImage.classList.toggle("rotate");
    categoryDropdown.classList.toggle("open");
}

/**Function that rotates on opening/closing the category dropdown */
document.addEventListener("click", function(e){
    const categoryInput = document.getElementById("category-input");
    const categoryDropdown = document.getElementById("category-dropdown");
    const assignmentArrowImg = document.getElementById("category-arrow");

    if (!categoryInput.contains(e.target) && !categoryDropdown.contains(e.target)) {
        categoryDropdown.classList.remove("open");
        assignmentArrowImg.classList.remove("rotate");
    }
});

/**Function to check if user chose a category. */
function checkCategory() {
    let categoryInputWarning = document.getElementById('category-warning');
    let categoryInput = document.getElementById("category");

    if (currentCategory === '') {
        categoryInputWarning.innerHTML = "This field is required.";
        categoryInputWarning.style.color = "#e60025";
        categoryInput.classList.add("invalid");}
    if (currentCategory !== '') {
        descriptionResultDiv.innerHTML = "";
        categoryInput.classList.remove("invalid");}
}


/**Function to select chosen category that gives a user response and stores chosen category in currentCategory array.*/
function choseTechnicalTask() {
    let categoryInput = document.getElementById("category");
    categoryInput.value = "Technical Task";
    currentCategory = "Technical Task";
    openCloseCategoryDropdown();
    console.log(currentCategory);
    
}

/**Function to select chosen category that gives a user response and stores chosen category in currentCategory array.*/
function choseUserStory() {
    let categoryInput = document.getElementById("category");
    categoryInput.value = "User Story";
    currentCategory = "User Story";
    openCloseCategoryDropdown();
    console.log(currentCategory);
}

/**Function to show input buttons from the first tryped character in the input field. */
function showHideSubtaskButtons() {
    let subtasks = document.getElementById("subtasks");

    subtasks.value.length === 0 
    
    ? document.getElementById("subtask-button-container").classList.add("d_none") 
    : document.getElementById("subtask-button-container").classList.remove("d_none");
}

/**Function to empty the input field. */
function clearInputField() {
    let subtasks = document.getElementById("subtasks");
    subtasks.value = '';
    document.getElementById("subtask-button-container").classList.add("d_none"); 
}

/**function that adds the value of input to the list of subtasks. */
function addSubtaskToList() {
    let subtasks = document.getElementById("subtasks");
    let subtaskList = document.getElementById("subtask-list");
    
    subtaskList.innerHTML += addSubtaskTemplate(subtasks, subtaskIndex);

    subtaskListArray = Array.from(document.getElementsByClassName("subtask-element")).map(li => li.textContent.trim());
    console.log(subtaskListArray);

    subtaskIndex++;
}

//Function to delete chosen subtask from list
function deleteSubtaskListElement(id) {
    let subtaskElement = document.getElementById(id);
    subtaskElement.remove();
    subtaskListArray = Array.from(document.getElementsByClassName("subtask-element")).map(li => li.textContent.trim());
    console.log(subtaskListArray);
}
//Functions to edit an added subtask by changing an li element into an imput field and on saving changing back to li.
function editSubtask(taskId) {
    const box = document.getElementById(taskId);
    const li = box.querySelector("li.subtask-element");
    const oldText = li.textContent.trim();

    const input = createEditInput(oldText);
    box.innerHTML = "";
    box.appendChild(input);

    const buttonContainer = createEditButtons(input, box, taskId);
    box.appendChild(buttonContainer);

    console.log(subtaskListArray);
}

/**Function that creates an input field with what the user can directly edit the added subtask. */
function createEditInput(text) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = text;
    input.id = "edit_subtask_input";
    return input;
}

/**function that creates new buttons and a divider in the new input field. */
function createEditButtons(input, box, taskId) {
    const container = document.createElement("div");
    container.className = "subtask-list-button-container";

    const deleteBtn = createButton('./assets/img/add_task/delete.svg', () => {
        deleteSubtaskListElement(taskId);
        subtaskListArray = Array.from(document.getElementsByClassName("subtask-element")).map(li => li.textContent.trim());
        console.log(subtaskListArray);
    });
    const divider = createDivider();
    const saveBtn = createButton('./assets/img/add_task/check.svg', () => {
        box.innerHTML = editedSubtaskTemplate(taskId, input.value.trim());
        subtaskListArray = Array.from(document.getElementsByClassName("subtask-element")).map(li => li.textContent.trim());
        console.log(subtaskListArray);
    });

    container.append(deleteBtn, divider, saveBtn);
    return container;
}

/**Function that creates editing buttons to the new input field. */
function createButton(imgSrc, onClick) {
    const btn = document.createElement("div");
    btn.className = "subtask-button";
    btn.innerHTML = `<img src="${imgSrc}" alt="button">`;
    btn.addEventListener("click", onClick);
    return btn;
}

/**Function that creates a divider between the two buttons. */
function createDivider() {
    const div = document.createElement("div");
    div.innerHTML = '<img src="./assets/img/add_task/Vector 3.svg" alt="Divider">';
    return div;
}