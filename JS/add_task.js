let userInitials = '';
let username = '';

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

function putSelfOnFirstPlace(username) {
   let array = contacts.findIndex(e => e.name == username);
   if (array !== -1) contacts.unshift(...contacts.splice(array, 1));
   console.log(contacts);
   
}


function checkFullfilledRequirements() {
    let taskTitle = document.getElementById('title').value;
    let taskDescription = document.getElementById('description').value;
    let taskDueDate = document.getElementById('date').value;
    let taskPriority = currentPriotity;
    let taskCategory = currentCategory;
    let taskAssignments = selectedContacts;
    let taskSubtasks = subtaskListArray;

    if (taskTitle === '' || taskDescription === '' || taskDueDate === '' || currentCategory === '') {
        checkTitle();
        checkDescription();
        checkDate();
        checkCategory();
        return
    }

    console.log(createTaskObject(taskTitle, taskDescription, taskDueDate, taskPriority, taskCategory, taskAssignments, taskSubtasks));
    uploadTask(taskTitle, taskDescription, taskDueDate, taskPriority, taskCategory, taskAssignments, taskSubtasks);
    /*createTaskObject(taskTitle, taskDescription, taskDueDate, taskPriority, taskCategory, taskAssignments, taskSubtasks);*/
}

function createTaskObject(taskTitle, taskDescription, taskDueDate, taskPriority, taskCategory, taskAssignments, taskSubtasks) {
    return {
        title : taskTitle,
        description : taskDescription,
        date : taskDueDate,
        priority: taskPriority,
        category: taskCategory,
        assignedPersons: taskAssignments,
        subtasks: taskSubtasks,
        createdAt: new Date().toISOString()
    }
}