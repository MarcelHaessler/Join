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