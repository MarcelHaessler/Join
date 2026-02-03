let editedTitle = '';
let editedDescription = '';
let editedDueDate = '';
let editedPriority = '';

//Function to save title in editedTitle variable. If title input is empty, save the original title.
function editSaveTitle() {
    const titleInput = document.getElementById('edit-title');
    editedTitle = titleInput.value.trim() || editedTitle;
}

//Function to save description in editedDescription variable. If description input is empty, save the original description.
function editSaveDescription() {
    const descriptionInput = document.getElementById('edit-description');
    editedDescription = descriptionInput.value.trim() || editedDescription;
}

//Function to save due date in editedDueDate variable. If date input is empty, save the original date.
function editSaveDueDate() {
    const dateInput = document.getElementById('edit-date');
    editedDueDate = dateInput.value.trim() || editedDueDate;
}

// Function to check and set the task priority in the edit task overlay
function checkTaskPriority(priority) {
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

function editIsCorrectDate(dateString) {
    if (!dateString) return false;
    
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let selectedDate = new Date(dateString);
    selectedDate.setHours(0, 0, 0, 0);
    
    return selectedDate.getTime() >= today.getTime();
}

function editCheckDate() {
    const inputBorder = document.getElementById("edit-date");
    const resultDiv = document.getElementById("edit-date-warning");

    if (!inputBorder || !resultDiv) return true;
    
    function show(msg) {
        resultDiv.innerHTML = msg;
        resultDiv.style.color = "#e60025";
    }

    if (!inputBorder.value) {
        inputBorder.classList.add("invalid");
        show("This field is required.");
        return true;
    }
    if (!editIsCorrectDate(inputBorder.value)) {
        inputBorder.classList.add("invalid");
        show("Date must be today or in the future");
        return true;
    }
    inputBorder.classList.remove("invalid");
    show("");
    return false;
}