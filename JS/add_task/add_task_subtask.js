/**
 * Counter for generating unique subtask IDs.
 * @type {number}
 */
let subtaskIndex = 0;

/**
 * Array containing all subtask text values.
 * @type {string[]}
 */
let subtaskListArray = [];

/**
 * Shows or hides the subtask control buttons based on input.
 * @returns {void}
 */
function showHideSubtaskButtons() {
    let subtasks = document.getElementById("subtasks");

    subtasks.value.length === 0

        ? document.getElementById("subtask-button-container").classList.add("d_none")
        : document.getElementById("subtask-button-container").classList.remove("d_none");
}

/**
 * Clears the subtask input field.
 * @returns {void}
 */
function clearInputField() {
    let subtasks = document.getElementById("subtasks");
    subtasks.value = '';
    document.getElementById("subtask-button-container").classList.add("d_none");
}

/**
 * Adds a subtask to the list and resets the input.
 * @returns {void}
 */
function addSubtaskToList() {
    let subtasks = document.getElementById("subtasks");
    let subtaskList = document.getElementById("subtask-list");
    if (subtasks.value.trim() === '') {
        clearInputField();
        return;
    }
    subtaskList.innerHTML += addSubtaskTemplate(subtasks, subtaskIndex);
    subtaskListArray = Array.from(document.getElementsByClassName("subtask-element")).map(li => li.textContent.trim());
    subtaskIndex++;
    clearInputField();
}

/**
 * Deletes a subtask from the list.
 * @param {string} id - The ID of the subtask element.
 * @returns {void}
 */
function deleteSubtaskListElement(id) {
    let subtaskElement = document.getElementById(id);
    subtaskElement.remove();
    subtaskListArray = Array.from(document.getElementsByClassName("subtask-element")).map(li => li.textContent.trim());
}

/**
 * Switches a subtask list item to edit mode (input field).
 * @param {string} taskId - The ID of the subtask element.
 * @returns {void}
 */
function editSubtask(taskId) {
    const box = document.getElementById(taskId);
    const li = box.querySelector("li.subtask-element");
    const oldText = li.textContent.trim();

    replaceWithEditInput(box, oldText);
    addEditButtons(box, taskId);
}

/**
 * Replaces text content with an input field for editing.
 * @param {HTMLElement} box - The container element.
 * @param {string} text - The current text.
 * @returns {void}
 */
function replaceWithEditInput(box, text) {
    const input = createEditInput(text);
    box.innerHTML = "";
    box.appendChild(input);
}

/**
 * Adds Save and Delete buttons to the edit input.
 * @param {HTMLElement} box - The container element.
 * @param {string} taskId - The subtask ID.
 * @returns {void}
 */
function addEditButtons(box, taskId) {
    const input = box.querySelector("input");
    const buttonContainer = createEditButtons(input, box, taskId);
    box.appendChild(buttonContainer);
}

/**
 * Creates the input element for editing.
 * @param {string} text - The initial value.
 * @returns {HTMLInputElement} The created input.
 */
function createEditInput(text) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = text;
    input.id = "edit_subtask_input";
    return input;
}

/**
 * Creates the button container for edit actions.
 * @param {HTMLInputElement} input - The input element.
 * @param {HTMLElement} box - The container element.
 * @param {string} taskId - The subtask ID.
 * @returns {HTMLElement} The container div.
 */
function createEditButtons(input, box, taskId) {
    const container = document.createElement("div");
    container.className = "subtask-list-button-container";

    const deleteBtn = createButton('./assets/img/add_task/delete.svg', () => {
        deleteSubtaskListElement(taskId);
        subtaskListArray = Array.from(document.getElementsByClassName("subtask-element")).map(li => li.textContent.trim());
    });
    const divider = createDivider();
    const saveBtn = createButton('./assets/img/add_task/check.svg', () => {
        box.innerHTML = editedSubtaskTemplate(taskId, input.value.trim());
        subtaskListArray = Array.from(document.getElementsByClassName("subtask-element")).map(li => li.textContent.trim());
    });

    container.append(deleteBtn, divider, saveBtn);
    return container;
}

/**
 * Helper to create a functional button.
 * @param {string} imgSrc - Path to the icon image.
 * @param {Function} onClick - Click handler.
 * @returns {HTMLElement} The button element.
 */
function createButton(imgSrc, onClick) {
    const btn = document.createElement("div");
    btn.className = "subtask-button";
    btn.innerHTML = `<img src="${imgSrc}" alt="button">`;
    btn.addEventListener("click", onClick);
    return btn;
}

/**
 * Creates a visual divider.
 * @returns {HTMLElement} The divider element.
 */
function createDivider() {
    const div = document.createElement("div");
    div.innerHTML = '<img src="./assets/img/add_task/Vector 3.svg" alt="Divider">';
    return div;
}

/**
 * Handles Enter key to submit subtask.
 * @param {KeyboardEvent} event - The keyboard event.
 * @returns {void}
 */
function handleSubtaskEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();

        const input = document.getElementById("subtasks");

        if (input.value.trim() !== "") {
            addSubtaskToList();
            document.getElementById("subtasks").value = "";
        }
    }
}