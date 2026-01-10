 const ToDo = document.getElementById('todo-tiles');
 const InProgress = document.getElementById('progress-tiles');
 const Awaiting = document.getElementById('feedback-tiles');
 const Done = document.getElementById('done-tiles');
 let currentDraggedElement;
 const BASE_URL = 'https://join-ad1a9-default-rtdb.europe-west1.firebasedatabase.app/';


//  const boards = {
//   "To do": document.getElementById("todo-tiles"),
//   "In progress": document.getElementById("progress-tiles"),
//   "Awaiting feedback": document.getElementById("feedback-tiles"),
//   "Done": document.getElementById("done-tiles")
// };

window.addEventListener("tasksLoaded", () => {
    // fetchTasks();
    updateBoard();
});

function updateBoard() {
    // console.log(tasks);
    // let openToDo = tasks.filter(t => t['taskgroup'] == 'ToDo');
    // console.log(openToDo.length);
    // ToDo.innerHTML = '';

    // for (let index = 0; index < openToDo.length; index++) {
    //     const element = openToDo[index];
    //     ToDo.innerHTML += generateTodoHTML(element);
    // }


    let statuses = ['ToDo', 'InProgress', 'Awaiting', 'Done'];
    statuses.forEach(status => {
        let filteredTasks = tasks.filter(t => t['taskgroup'] == status);
        
        let container = document.getElementById(status);
        
        // c) Container leeren
        container.innerHTML = '';

        // d) Elemente rendern (hier nutze ich forEach statt der for-Schleife, ist moderner)
        filteredTasks.forEach(element => {
            container.innerHTML += generateTodoHTML(element);
        });
    });
}

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(taskgroup) {
    const task = tasks.find(t => t.id === currentDraggedElement);
    console.log('Moved to ' + task.title);
    console.log(task.taskgroup);
    task.taskgroup = taskgroup;
    console.log(task.taskgroup);
    updateTask(task);
    updateBoard()
}

async function updateTask(task) {
    console.log('Updating taskgroup for ' + task.title);
    await fetch(`${BASE_URL}/tasks/${task.id}.json`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({taskgroup: task.taskgroup})
    });
    generateTodoHTML(task);
}

// function highlight(id) {
//     document.getElementById(id).classList.add('drag-area-highlight');
// }

// function removeHighlight(id) {
//     document.getElementById(id).classList.remove('drag-area-highlight');
// }