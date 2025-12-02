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

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', () => {
        if (input.id === 'date') {
            checkDate();
        }
        if (input.id === 'title') {
            checkTitle();
        }
    });
});

document.querySelector('textarea').addEventListener('blur', () => checkDescription());

function checkTitle() {
    const titleInput = document.getElementById("title");
    const titleResultDiv = document.getElementById("title-warning");


    if (titleInput.value.length === 0) {
        titleResultDiv.innerHTML = "This field is required.";
        titleResultDiv.style.color = "#e60025";
        titleInput.classList.add("invalid");}
    if (titleInput.value.length > 0) {
        titleResultDiv.innerHTML = "";
        titleInput.classList.remove("invalid");}
}

function checkDescription() {
    const descriptionInput = document.getElementById("description");
    const descriptionResultDiv = document.getElementById("description-warning");
    
    if (descriptionInput.value.length === 0) {
        descriptionResultDiv.innerHTML = "This field is required.";
        descriptionResultDiv.style.color = "#e60025";
        descriptionInput.classList.add("invalid");}
    if (descriptionInput.value.length > 0) {
        descriptionResultDiv.innerHTML = "";
        descriptionInput.classList.remove("invalid");}
}

const dateInput = document.getElementById('date');

/**Function that adds / between numbers to cut up the date */
dateInput.addEventListener('input', function (e) {
  let value = e.target.value.replace(/\D/g, ""); 

  if (value.length > 8) value = value.slice(0, 8); 

  let formatted = "";
  if (value.length > 0) formatted = value.slice(0, 2);
  if (value.length > 2) formatted += "/" + value.slice(2, 4);
  if (value.length > 4) formatted += "/" + value.slice(4, 8);

  e.target.value = formatted;
});

/**Function that checks if the input date is today or in the future */
const isCorrectDate = (date) =>{
    let today = new Date();
    today.setHours(0,0,0,0); // Set time to midnight for accurate comparison

    date = date.split("/");
    date = new Date(date[2], date[1] - 1, date[0]); 
    date.setHours(0,0,0,0); // Set time to midnight for accurate comparison

    if (today.getTime() === date.getTime()) {
        return true
    } else if (today.getTime() < date.getTime()) {
        return true
    }else if (today.getTime() > date.getTime()) {
        return false
    }
}

/**Function that checks the input date and gives a User response if date is incorrect
 * or missing.
 */
function checkDate() {
    const inputBorder = document.getElementById("date"); 
    resultDiv = document.getElementById("date-warning");
    dateReg = /(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/201[4-9]|20[2-9][0-9]/;

    if (!dateInput.value) {
        inputBorder.classList.add("invalid");
        return show("This field is required.");}
    if (!dateReg.test(dateInput.value)) {
        inputBorder.classList.add("invalid");
        return show("It's an invalid date");}
    if (!isCorrectDate(dateInput.value)){
        inputBorder.classList.add("invalid");
        return show("It's an invalid date");}
    if (isCorrectDate(dateInput.value)){
        inputBorder.classList.remove("invalid");
        return show("");}

    function show(msg) { resultDiv.innerHTML = msg; resultDiv.style.color = "#e60025"; }
}

//Button color changing functions on click
let currentPriotity = '';

let urgentBtn = document.getElementById('urgent-btn');
let mediumBtn = document.getElementById('medium-btn');
let lowBtn = document.getElementById('low-btn');

let urgentImg = document.getElementById('urgent-img');
let mediumImg = document.getElementById('medium-img');
let lowImg = document.getElementById('low-img');

urgentBtn.addEventListener('click', () => {
    urgentBtn.disabled = true;
    urgentBtn.classList.add('no-hover')
    urgentBtn.style.cursor = 'default';
    urgentBtn.style.backgroundColor = 'rgba(255, 61, 0, 1)';
    urgentBtn.style.color = 'white';
    urgentImg.src = './assets/img/add_task/urgent-active.svg'
    mediumBtnToNormal();
    lowBtnToNormal();
    currentPriotity = 'urgent';
    console.log(currentPriotity);
});

mediumBtn.addEventListener('click', () => {
    mediumBtn.disabled = true;
    mediumBtn.classList.add('no-hover')
    mediumBtn.style.cursor = 'default';
    mediumBtn.style.backgroundColor = 'rgba(255, 168, 0, 1)';
    mediumBtn.style.color = 'white';
    mediumImg.src = './assets/img/add_task/medium-active.svg'
    urgentBtnToNormal();
    lowBtnToNormal();
    currentPriotity = 'medium';
    console.log(currentPriotity);
});

lowBtn.addEventListener('click', () => {
    lowBtn.disabled = true;
    lowBtn.classList.add('no-hover')
    lowBtn.style.cursor = 'default';
    lowBtn.style.backgroundColor = 'rgba(122, 226, 41, 1)';
    lowBtn.style.color = 'white';
    lowImg.src = './assets/img/add_task/low-active.svg'
    mediumBtnToNormal();
    urgentBtnToNormal();
    currentPriotity = 'low';
    console.log(currentPriotity);
});

function urgentBtnToNormal() {
    urgentBtn.disabled = false;
    urgentBtn.classList.remove('no-hover')
    urgentBtn.style.cursor = 'pointer';
    urgentBtn.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    urgentBtn.style.color = 'black';
    urgentImg.src = './assets/img/add_task/urgent.svg'
}

function mediumBtnToNormal() {
    mediumBtn.disabled = false;
    mediumBtn.classList.remove('no-hover')
    mediumBtn.style.cursor = 'pointer';
    mediumBtn.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    mediumBtn.style.color = 'black';
    mediumImg.src = './assets/img/add_task/medium.svg'
}

function lowBtnToNormal() {
    lowBtn.disabled = false;
    lowBtn.classList.remove('no-hover')
    lowBtn.style.cursor = 'pointer';
    lowBtn.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    lowBtn.style.color = 'black';
    lowImg.src = './assets/img/add_task/low.svg'
}

let contacts = [];

async function fetchContacts() {
    let response = await fetch("https://join-ad1a9-default-rtdb.europe-west1.firebasedatabase.app/.json");
    let data = await response.json();
    for (let key in data.users) {
        if (data.users[key]) {   // nur echte Objekte
            contacts.push(data.users[key]);
        }
    }

    contacts.forEach((users, i) => {
    users.colorIndex = (i % 15) + 1;
    });

    console.log(contacts);
}

function putSelfOnFirstPlace(username) {
   let array = contacts.findIndex(e => e.name == username);
   if (array !== -1) contacts.unshift(...contacts.splice(array, 1));
   console.log(contacts);
   
}

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

function renderAssignmentDropdown() {
    let contactsDropdown = document.getElementById("contacts-dropdown");
    contactsDropdown.classList.toggle("open");

    let arrowImage = document.getElementById("assignment-arrow");
    arrowImage.classList.toggle("rotate");

    addInitialsBackgroundColors();
    searchContact();
}


function addInitialsBackgroundColors() {
    let contactInitials = document.querySelectorAll(".contact-initials");

    contactInitials.forEach((initial, index) => {
        let contact = contacts[index];
 
        initial.style.backgroundImage =
            `url('../assets/img/contacts/color${contact.colorIndex}.svg')`;
    });
}

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

let searchTimeout;

function delaySearchContact() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => searchContact(), 500);
}

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

let selectedContacts =[];

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

function addChosenInitialsBackgroundColors() {
    let chosenContactInitials = document.querySelectorAll(".chosen-contact-initials");

    chosenContactInitials.forEach((initial, index) => {
        let contact = selectedContacts[index];
        initial.style.backgroundImage =
            `url('../assets/img/contacts/color${contact.colorIndex}.svg')`;
    });
}

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

function openCloseCategoryDropdown() {
    let categoryDropdown = document.getElementById("category-dropdown");
    let arrowImage = document.getElementById("category-arrow");
    arrowImage.classList.toggle("rotate");
    categoryDropdown.classList.toggle("open");
}

document.addEventListener("click", function(e){
    const categoryInput = document.getElementById("category-input");
    const categoryDropdown = document.getElementById("category-dropdown");
    const assignmentArrowImg = document.getElementById("category-arrow");

    if (!categoryInput.contains(e.target) && !categoryDropdown.contains(e.target)) {
        categoryDropdown.classList.remove("open");
        assignmentArrowImg.classList.remove("rotate");
    }
});

let currentCategory = ""

function choseTechnicalTask() {
    let categoryInput = document.getElementById("category");
    categoryInput.value = "Technical Task";
    currentCategory = "Technical Task";
    openCloseCategoryDropdown();
    console.log(currentCategory);
    
}

function choseUserStory() {
    let categoryInput = document.getElementById("category");
    categoryInput.value = "User Story";
    currentCategory = "User Story";
    openCloseCategoryDropdown();
    console.log(currentCategory);
}


function showHideSubtaskButtons() {
    let subtasks = document.getElementById("subtasks");

    subtasks.value.length === 0 
    
    ? document.getElementById("subtask-button-container").classList.add("d_none") 
    : document.getElementById("subtask-button-container").classList.remove("d_none");
}

function clearInputField() {
    let subtasks = document.getElementById("subtasks");
    subtasks.value = '';
    document.getElementById("subtask-button-container").classList.add("d_none"); 
}

let subtaskIndex = 0;

function addSubtaskToList() {
    let subtasks = document.getElementById("subtasks");
    let subtaskList = document.getElementById("subtask-list");
    
    subtaskList.innerHTML += `<div class="subtask-element-box" id="task${subtaskIndex}">  
                                <li class="subtask-element">${subtasks.value}</li>
                                <div class="subtask-list-button-container">
                                    <div class="subtask-button" onclick="">
                                        <img class="subtask-list-button" src="./assets/img/add_task/edit.svg" alt="Edit">
                                    </div>
                                    <img src="./assets/img/add_task/Vector 3.svg" alt="Divider">
                                    <div class="subtask-button" onclick="deleteSubtaskListElement('task${subtaskIndex}')">
                                        <img class="subtask-list-button" id="delete-button" src="./assets/img/add_task/delete.svg" alt="Delete">
                                    </div>
                                </div>
                            </div>`;
    
    let subtaskListArray = Array.from(document.getElementsByClassName("subtask-element"));
    console.log(subtaskListArray);

    subtaskIndex++;
}

//Function to delete chosen subtask from list
function deleteSubtaskListElement(id) {
    let subtaskElement = document.getElementById(id);
    subtaskElement.remove();
}

/**By clicking on the clear button in subtasks, the buttons should disappear.
 * OnBlur functions have to be repaired. often they do the exact opposite that we want. instead toggle we need remove or add.
 */