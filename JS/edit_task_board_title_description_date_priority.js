//Variable to store title of edited task
let editedTitle = '';

//Variable to store description of edited task
let editedDescription = '';

//Variable to store due date of edited task
let editedDueDate = '';

// Global variable to store the edited priority
editedPriority = '';

//Function to save title in editedTitle variable. If title input is empty, save the original title.
function editSaveTitle() {
    const titleInput = document.getElementById('edit-title');
    editedTitle = titleInput.value.trim() || editedTitle;
    console.log('Edited Title:', editedTitle);
}

//Function to save description in editedDescription variable. If description input is empty, save the original description.
function editSaveDescription() {
    const descriptionInput = document.getElementById('edit-description');
    editedDescription = descriptionInput.value.trim() || editedDescription;
    console.log('Edited Description:', editedDescription);
}

//Function to save due date in editedDueDate variable. If date input is empty, save the original date.
function editSaveDueDate() {
    const dateInput = document.getElementById('edit-date');
    editedDueDate = dateInput.value.trim() || editedDueDate;
    console.log('Edited Due Date:', editedDueDate);
}

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


const editDateInput = document.getElementById('edit-date');

function formatEditDateInput(e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    let formatted = "";
    if (value.length > 0) formatted = value.slice(0, 2);
    if (value.length > 2) formatted += "/" + value.slice(2, 4);
    if (value.length > 4) formatted += "/" + value.slice(4, 8);
    e.target.value = formatted;
}

function editIsCorrectDate(date) {
    let today = new Date();
    today.setHours(0,0,0,0);
    let [d, m, y] = date.split("/");
    let entered = new Date(+y, +m - 1, +d);
    entered.setHours(0,0,0,0);

    if (String(entered.getDate()).padStart(2, "0") !== d ||
        String(entered.getMonth() + 1).padStart(2, "0") !== m ||
        String(entered.getFullYear()) !== y) return false;

    return entered.getTime() >= today.getTime();
}

function editCheckDate() {
    const inputBorder = document.getElementById("edit-date");
    const resultDiv = document.getElementById("edit-date-warning");
    const dateReg = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(201[4-9]|20[2-9][0-9])$/;

    if (!inputBorder || !resultDiv) return true;

    if (!inputBorder.value || inputBorder.value.replace(/\D/g, "").length < 8) {
        inputBorder.classList.add("invalid");
        show("This field is required.");
        return true;
    }
    if (!dateReg.test(inputBorder.value)) {
        inputBorder.classList.add("invalid");
        show("It's an invalid date");
        return true;
    }
    if (!editIsCorrectDate(inputBorder.value)){
        inputBorder.classList.add("invalid");
        show("It's an invalid date");
        return true;
    }
    inputBorder.classList.remove("invalid");
    show("");
    return false;

    function show(msg) {
        resultDiv.innerHTML = msg;
        resultDiv.style.color = "#e60025";
    }
}