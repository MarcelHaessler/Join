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
    for (let key in data.contact) {contacts.push(data.contact[key]);}
    console.log(contacts);
}

function renderAssignmentDropdown() {
    let contactsDropdown = document.getElementById("contacts-dropdown");
    contactsDropdown.classList.toggle("open");
    contactsDropdown.innerHTML = "";

    let arrowImage = document.getElementById("assignment-arrow");
    arrowImage.classList.toggle("rotate");

    for (let index = 0; index < contacts.length; index++) {
        let contactName = contacts[index].name;
        let contactInitials = contacts[index].name.charAt(0).toUpperCase() + contacts[index].name.charAt(contacts[index].name.indexOf(" ") + 1).toUpperCase();
        contactsDropdown.innerHTML += addTaskContactTemplate(contactName, contactInitials);
    }
    addInitialsBackgroundColors();
    searchContact();
}

function addInitialsBackgroundColors() {
    let contactInitials = document.querySelectorAll(".contact-initials");
    let colorIndex = 1;
    for (let index = 0; index < contactInitials.length; index++) {
        if (colorIndex > 15) {colorIndex = 1;}
        contactInitials[index].style.backgroundImage = `url('../assets/img/contacts/color${colorIndex}.svg')`;
        colorIndex++;
    }
}

document.addEventListener("click", function(e){
    const assignmentInput = document.getElementById("assign-input");
    const assignmentDropdown = document.getElementById("contacts-dropdown");

    if (!assignmentInput.contains(e.target) && !assignmentDropdown.contains(e.target)) {
        assignmentDropdown.classList.remove("open");
    }
});

let searchTimeout;

function delaySearchContact() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => searchContact2(), 500);
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

function openCloseCategoryDropdown() {
    let categoryDropdown = document.getElementById("category-dropdown");
    let arrowImage = document.getElementById("category-arrow");
    arrowImage.classList.toggle("rotate");
    categoryDropdown.classList.toggle("open");
}

document.addEventListener("click", function(e){
    const categoryInput = document.getElementById("category-input");
    const categoryDropdown = document.getElementById("category-dropdown");

    if (!categoryInput.contains(e.target) && !categoryDropdown.contains(e.target)) {
        categoryDropdown.classList.remove("open");
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