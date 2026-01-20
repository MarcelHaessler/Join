let userInitials = '';
let username = '';
let taskgroup = "ToDo"

window.addEventListener("userReady", async (auth) => {
    console.log("Name:", auth.detail.name, "Mail:", auth.detail.email);
    username = auth.detail.name
    await fetchContacts();
    await fetchTasks();
    putSelfOnFirstPlace(username);
    userInitials = username.charAt(0).toUpperCase() + username.charAt(username.indexOf(" ") + 1).toUpperCase();
    addInitialToHeader();
    fillAssignmentDropdown();
});

function addInitialToHeader() {
    let initialSpace = document.getElementById('user-initials');
    initialSpace.innerHTML = userInitials;
}

function putSelfOnFirstPlace(username) {
    let array = contacts.findIndex(e => e.name == username);
    if (array !== -1) contacts.unshift(...contacts.splice(array, 1));
}

function checkFullfilledRequirements() {
    let taskTitle = document.getElementById('title').value;
    let taskDescription = document.getElementById('description').value;
    let taskDueDate = document.getElementById('date').value;
    let taskPriority = currentPriotity;
    let taskCategory = currentCategory;
    let taskAssignments = selectedContacts;
    let taskSubtasks = subtaskListArray || [];

    if (taskTitle === '' || taskDescription === '' || taskDueDate === '' || currentCategory === '') {
        checkTitle();
        checkDescription();
        checkDate();
        checkCategory();
        return
    }
    uploadTask(taskTitle, taskDescription, taskDueDate, taskPriority, taskCategory, taskgroup, taskAssignments, taskSubtasks);
    clearTask();
}

function createTaskObject(taskTitle, taskDescription, taskDueDate, taskPriority, taskCategory, taskgroup, taskAssignments, taskSubtasks) {
    return {
        title: taskTitle,
        description: taskDescription,
        date: taskDueDate,
        priority: taskPriority,
        category: taskCategory,
        assignedPersons: taskAssignments,
        subtasks: taskSubtasks.map(subtask => ({
            text: subtask,
            subtaskComplete: false
        })),
        createdAt: new Date().toISOString(),
        taskgroup: taskgroup,
        createdBy: username
    }
}

function clearTask() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('date').value = '';
    document.getElementById('category').value = '';
    currentCategory = '';

    currentPriotity = 'medium';
    defaultPriority();

    selectedContacts = [];
    renderSelectedContacts();
    resetAssignmentSelection();

    subtaskListArray = [];
    subtaskIndex = 0;
    document.getElementById('subtask-list').innerHTML = '';
    document.getElementById('subtasks').value = '';
    clearWarnings();
}

function resetAssignmentSelection() {
    document.querySelectorAll('.dropdown-box').forEach(box => {
        box.classList.remove('selected-contact');
    });

    document.querySelectorAll('[id^="checkbox"]').forEach(cb => {
        cb.src = './assets/img/checkbox_inactive.svg';
        cb.classList.remove('checkbox-active');
    });
}

function clearWarnings() {
    document.querySelectorAll('.invalid').forEach(el => {
        el.classList.remove('invalid');
    });

    document.querySelectorAll('[id$="-warning"]').forEach(warn => {
        warn.innerHTML = '';
    });
}