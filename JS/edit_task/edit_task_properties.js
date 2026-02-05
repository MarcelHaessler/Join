/**
 * JS functions to edit task title, description, due date, and priority.
 * Manages the form state and validations for these properties.
 */

let editedTitle = '';
let editedDescription = '';
let editedDueDate = '';
let editedPriority = '';

/**
 * Saves the edited title to the global variable.
 * Preserves the original title if input is empty.
 * @returns {void}
 */
function editSaveTitle() {
    const titleInput = document.getElementById('edit-title');
    editedTitle = titleInput.value.trim() || editedTitle;
}

/**
 * Saves the edited description to the global variable.
 * Preserves the original description if input is empty.
 * @returns {void}
 */
function editSaveDescription() {
    const descriptionInput = document.getElementById('edit-description');
    editedDescription = descriptionInput.value.trim() || editedDescription;
}

/**
 * Saves the edited due date to the global variable.
 * Preserves the original date if input is empty.
 * @returns {void}
 */
function editSaveDueDate() {
    const dateInput = document.getElementById('edit-date');
    editedDueDate = dateInput.value.trim() || editedDueDate;
}

/**
 * Sets the priority button state based on the task's current priority.
 * @param {string} priority - The priority level ('low', 'medium', 'urgent').
 * @returns {void}
 */
function checkTaskPriority(priority) {
    if (priority === 'low') {
        lowPriority();
    } else if (priority === 'medium') {
        mediumPriority();
    } else if (priority === 'urgent') {
        urgentPriority();
    }
}

/**
 * Sets the form state to Low priority.
 * @returns {void}
 */
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

/**
 * Sets the form state to Medium priority.
 * @returns {void}
 */
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

/**
 * Sets the form state to Urgent priority.
 * @returns {void}
 */
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

/**
 * Resets all priority buttons to their default (inactive) state.
 * @returns {void}
 */
function resetPriorityButtons() {
    const priorities = [
        { id: 'urgent-btn', imgId: 'urgent-img', icon: 'urgent.svg' },
        { id: 'medium-btn', imgId: 'medium-img', icon: 'medium.svg' },
        { id: 'low-btn', imgId: 'low-img', icon: 'low.svg' }
    ];
    priorities.forEach(p => resetSinglePriorityButton(p));
}

/**
 * Resets a single priority button.
 * @param {Object} priority - Object containing button IDs and icon.
 * @returns {void}
 */
function resetSinglePriorityButton(priority) {
    const btn = document.getElementById(priority.id);
    const img = document.getElementById(priority.imgId);
    if (btn && img) {
        btn.style.backgroundColor = 'white';
        btn.style.color = 'black';
        img.src = `./assets/img/add_task/${priority.icon}`;
        btn.classList.remove('no-hover');
        btn.style.cursor = 'pointer';
    }
}

/**
 * Resets the Urgent button to normal state.
 * @returns {void}
 */
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

/**
 * Resets the Medium button to normal state.
 * @returns {void}
 */
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

/**
 * Resets the Low button to normal state.
 * @returns {void}
 */
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

/**
 * Validates if a date string is valid and not in the past.
 * @param {string} dateString - The date string to check.
 * @returns {boolean} True if valid, false otherwise.
 */
function editIsCorrectDate(dateString) {
    if (!dateString) return false;

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let selectedDate = new Date(dateString);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate.getTime() >= today.getTime();
}

/**
 * Checks the date input field and shows/clears errors.
 * @returns {boolean} True if there is an error, false if valid.
 */
function editCheckDate() {
    const inputBorder = document.getElementById("edit-date");
    const resultDiv = document.getElementById("edit-date-warning");

    if (!inputBorder || !resultDiv) return true;

    if (!inputBorder.value) {
        return showEditDateError(inputBorder, resultDiv, "This field is required.");
    }
    if (!editIsCorrectDate(inputBorder.value)) {
        return showEditDateError(inputBorder, resultDiv, "Date must be today or in the future");
    }
    return clearEditDateError(inputBorder, resultDiv);
}

/**
 * Displays a date validation error.
 * @param {HTMLElement} inputBorder - The input element.
 * @param {HTMLElement} resultDiv - The error message container.
 * @param {string} msg - The error message.
 * @returns {boolean} Always true (indicating error).
 */
function showEditDateError(inputBorder, resultDiv, msg) {
    inputBorder.classList.add("invalid");
    resultDiv.innerHTML = msg;
    resultDiv.style.color = "#e60025";
    return true;
}

/**
 * Clears date validation errors.
 * @param {HTMLElement} inputBorder - The input element.
 * @param {HTMLElement} resultDiv - The error message container.
 * @returns {boolean} Always false (indicating success).
 */
function clearEditDateError(inputBorder, resultDiv) {
    inputBorder.classList.remove("invalid");
    resultDiv.innerHTML = "";
    return false;
}