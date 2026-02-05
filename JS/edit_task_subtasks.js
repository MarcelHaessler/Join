/**
 * Subtask management for the Edit Task overlay.
 * Handles adding, editing, and deleting subtasks.
 */

/**
 * Shows existing subtasks in the subtask list when opening the edit overlay.
 * @param {Object} task - The task object containing subtasks.
 * @returns {void}
 */
function showExistingSubtasks(task) {
    let subtaskList = document.getElementById("edit-subtask-list");
    subtaskList.innerHTML = '';
    resetSubtaskData();
    if (!task.subtasks || task.subtasks.length === 0) { return; }
    renderExistingSubtasks(task.subtasks, subtaskList);
}

/**
 * Resets the local subtask data array.
 * @returns {void}
 */
function resetSubtaskData() {
    editedSubtaskListArray = [];
    subtaskIndex = 0;
}

/**
 * Renders existing subtasks into the list.
 * @param {Array} subtasks - The array of subtasks.
 * @param {HTMLElement} subtaskList - The DOM element to render into.
 * @returns {void}
 */
function renderExistingSubtasks(subtasks, subtaskList) {
    subtasks.forEach((subtask, index) => {
        subtaskList.innerHTML += editAddSubtaskTemplate({ value: subtask.text }, index);
        editedSubtaskListArray.push({
            text: subtask.text,
            subtaskComplete: !!subtask.subtaskComplete
        });
        subtaskIndex++;
    });
}

/**
 * Shows or hides the subtask confirmation/clear buttons based on input.
 * @returns {void}
 */
function editShowHideSubtaskButtons() {
    let subtasks = document.getElementById("edit-subtasks");
    subtasks.value.length === 0
        ? document.getElementById("edit-subtask-button-container").classList.add("d_none")
        : document.getElementById("edit-subtask-button-container").classList.remove("d_none");
}

/**
 * Clears the subtask input field.
 * @returns {void}
 */
function editClearInputField() {
    let subtasks = document.getElementById("edit-subtasks");
    subtasks.value = '';
    document.getElementById("edit-subtask-button-container").classList.add("d_none");
}

/**
 * Adds a new subtask from the input field to the list.
 * @returns {void}
 */
function editAddSubtaskToList() {
    let subtasks = document.getElementById("edit-subtasks");
    let subtaskList = document.getElementById("edit-subtask-list");
    subtaskList.innerHTML += editAddSubtaskTemplate({ value: subtasks.value }, subtaskIndex);
    editedSubtaskListArray.push({
        text: subtasks.value.trim(),
        subtaskComplete: false
    });
    subtaskIndex++;
    editClearInputField();
}

/**
 * Deletes a subtask from the list and the local array.
 * @param {string} id - The DOM ID of the subtask element.
 * @param {string|null} textToDelete - The text of the subtask to delete (optional).
 * @returns {void}
 */
function editDeleteSubtaskListElement(id, textToDelete = null) {
    let subtaskElement = document.getElementById(id);
    if (!subtaskElement) return;

    let text = textToDelete;

    // Attempt to find text if not provided
    if (!text) {
        let li = subtaskElement.querySelector('.edit-subtask-element');
        let input = subtaskElement.querySelector('#edit-subtask-input');

        if (li) {
            text = li.textContent.trim();
        } else if (input) {
            text = input.value.trim();
        }
    }

    // Remove visually
    subtaskElement.remove();

    // Remove from array
    if (text) {
        editedSubtaskListArray = editedSubtaskListArray.filter(obj => obj.text.trim() !== text.trim());
    }
}

/**
 * Switches a subtask list item to edit mode (input field).
 * @param {string} taskId - The DOM ID of the subtask container.
 * @returns {void}
 */
function editSubtaskEditing(taskId) {
    const box = document.getElementById(taskId);
    if (!box) return;
    const li = box.querySelector("li.edit-subtask-element");
    if (!li) return;
    const oldText = li.textContent.trim();
    replaceEditWithInput(box, oldText);
    addEditSubtaskButtons(box, taskId, oldText);
}

/**
 * Replaces the subtask text text with an input field.
 * @param {HTMLElement} box - The container element.
 * @param {string} text - The current subtask text.
 * @returns {void}
 */
function replaceEditWithInput(box, text) {
    const input = editCreateEditInput(text);
    box.innerHTML = "";
    box.appendChild(input);
}

/**
 * Adds Save and Delete buttons to the editing subtask.
 * @param {HTMLElement} box - The container element.
 * @param {string} taskId - The subtask ID.
 * @param {string} oldText - The original text.
 * @returns {void}
 */
function addEditSubtaskButtons(box, taskId, oldText) {
    const input = box.querySelector("input");
    const buttonContainer = editCreateEditButtons(input, box, taskId, oldText);
    box.appendChild(buttonContainer);
}

/**
 * Creates the input element for editing a subtask.
 * @param {string} text - The initial value.
 * @returns {HTMLInputElement} The created input element.
 */
function editCreateEditInput(text) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = text;
    input.id = "edit-subtask-input";
    return input;
}

/**
 * Creates the container with Edit/Delete buttons.
 * @param {HTMLInputElement} input - The input element.
 * @param {HTMLElement} box - The container box.
 * @param {string} taskId - The subtask ID.
 * @param {string} oldText - The original text.
 * @returns {HTMLElement} The button container.
 */
function editCreateEditButtons(input, box, taskId, oldText) {
    const container = document.createElement("div");
    container.className = "edit-subtask-list-button-container";
    const deleteBtn = editCreateButton('./assets/img/add_task/delete.svg', () => editDeleteSubtaskListElement(taskId, oldText));
    const divider = editCreateDivider();
    const saveBtn = createEditSaveButton(input, box, taskId, oldText);
    container.append(deleteBtn, divider, saveBtn);
    return container;
}

/**
 * Creates the Save button.
 * @param {HTMLInputElement} input - The input element.
 * @param {HTMLElement} box - The container box.
 * @param {string} taskId - The subtask ID.
 * @param {string} oldText - The original text.
 * @returns {HTMLElement} The save button element.
 */
function createEditSaveButton(input, box, taskId, oldText) {
    return editCreateButton('./assets/img/add_task/check.svg', () => {
        saveEditedSubtask(input, box, taskId, oldText);
    });
}

/**
 * Saves the edited subtask and updates the display.
 * @param {HTMLInputElement} input - The input element.
 * @param {HTMLElement} box - The container box.
 * @param {string} taskId - The subtask ID.
 * @param {string} oldText - The original text.
 * @returns {void}
 */
function saveEditedSubtask(input, box, taskId, oldText) {
    const newText = input.value.trim();
    if (!newText) return;
    box.innerHTML = editEditedSubtaskTemplate(taskId, newText);
    updateSubtaskInArray(oldText, newText);
}

/**
 * Updates the subtask text in the global array.
 * @param {string} oldText - The original text.
 * @param {string} newText - The new text.
 * @returns {void}
 */
function updateSubtaskInArray(oldText, newText) {
    const index = editedSubtaskListArray.findIndex(obj => obj.text === oldText);
    if (index !== -1) {
        const prevComplete = !!editedSubtaskListArray[index].subtaskComplete;
        editedSubtaskListArray[index] = { text: newText, subtaskComplete: prevComplete };
    } else {
        editedSubtaskListArray.push({ text: newText, subtaskComplete: false });
    }
}

/**
 * Helper to create a functional button with an icon.
 * @param {string} imgSrc - Path to the icon image.
 * @param {Function} onClick - Click handler.
 * @returns {HTMLElement} The button element.
 */
function editCreateButton(imgSrc, onClick) {
    const btn = document.createElement("div");
    btn.className = "edit-subtask-button";
    btn.innerHTML = `<img src="${imgSrc}" alt="button">`;
    btn.addEventListener("click", onClick);
    return btn;
}

/**
 * Creates a divider element.
 * @returns {HTMLElement} The divider element.
 */
function editCreateDivider() {
    const div = document.createElement("div");
    div.innerHTML = '<img src="./assets/img/add_task/Vector 3.svg" alt="Divider">';
    return div;
}

/**
 * Handles the Enter key press in the subtask input field to add the subtask.
 * @param {KeyboardEvent} event - The keyboard event.
 * @returns {void}
 */
function editHandleSubtaskEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();

        const input = document.getElementById("edit-subtasks");
        if (!input) return;
        if (input.value.trim() !== "") {
            editAddSubtaskToList();
            document.getElementById("edit-subtasks").value = "";
        }
    }
}
