/**Contacts functions to delete contacts, user feedback, and UI updates */

/**
 * Deletes a contact from the Firebase database
 * Removes contact from all tasks and refreshes the contact list
 * @async
 * @param {string} root - The root path ('users' or 'contact')
 * @param {string} id - The contact ID to delete
 * @returns {Promise<void>}
 */
async function deleteContact(root, id) {
    try {
        await removeContactFromTasks(id);
        const contactRef = db.ref(`${root}/${id}`);
        await contactRef.remove();
        contactDetails.innerHTML = "";
        sideBarvisible();
        await nameList();
        closeDialog();
        showContactMessage("Contact succesfully deleted");
    } catch (error) {
    }
}

/**
 * Removes a contact from all tasks they are assigned to
 * @async
 * @param {string} contactId - The ID of the contact to remove from tasks
 * @returns {Promise<void>}
 */
async function removeContactFromTasks(contactId) {
    const tasksRef = db.ref("tasks");
    const snapshot = await tasksRef.get();

    if (snapshot.exists()) {
        const tasks = snapshot.val();
        await updateAllTasksRemoveContact(tasks, contactId);
    }
}

/**
 * Iterates through all tasks and removes the contact from each
 * @async
 * @param {Object} tasks - Object containing all tasks
 * @param {string} contactId - The ID of the contact to remove
 * @returns {Promise<void>}
 */
async function updateAllTasksRemoveContact(tasks, contactId) {
    for (let taskId in tasks) {
        await removeContactFromSingleTask(tasks[taskId], taskId, contactId);
    }
}

/**
 * Removes a contact from a single task's assigned persons
 * Updates the task in Firebase if the contact was removed
 * @async
 * @param {Object} task - The task object
 * @param {string} taskId - The task ID
 * @param {string} contactId - The ID of the contact to remove
 * @returns {Promise<void>}
 */
async function removeContactFromSingleTask(task, taskId, contactId) {
    if (task.assignedPersons) {
        const originalLength = task.assignedPersons.length;
        task.assignedPersons = task.assignedPersons.filter(p => p.id !== contactId);

        if (task.assignedPersons.length !== originalLength) {
            const taskRef = db.ref(`tasks/${taskId}`);
            await taskRef.update({ assignedPersons: task.assignedPersons });
        }
    }
}

/**
 * Renders a letter section divider for the contact list
 * @param {string} letter - The letter to display
 * @returns {string} HTML string for the letter section
 */
function letterSection(letter) {
    return `<div class="sectionList">${letter}</div><hr>`
}


/**
 * Makes the mobile edit bar visible
 * @returns {void}
 */
function mobileEditBar() {
    const bar = document.getElementById('mobileEditeBar');
    if (bar) bar.classList.add('visible');
}

/**
 * Shows a success message with animation
 * Message automatically hides after 2 seconds
 * @param {string} text - The message text to display
 * @returns {void}
 */
function showContactMessage(text) {
    const message = document.getElementById('contact-message');
    if (!message) return;
    message.querySelector('p').textContent = text;
    message.classList.add('show');
    setTimeout(() => {
        message.classList.remove('show');
    }, 2000);
}