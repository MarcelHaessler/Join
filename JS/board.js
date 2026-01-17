const addTaskOverlay = document.getElementById('add-task-overlay');
const closeBtn = document.getElementById('close-add-task-overlay');

function addTaskOverlayOpen(boardGroup) {
    addTaskOverlay.classList.remove('d_none', 'closing');
    // kleine Verzögerung, damit CSS Transition greift
    setTimeout(() => {
        addTaskOverlay.classList.add('active');
    }, 10);
    taskgroup = boardGroup;
}

function addTaskOverlayClose() {
    addTaskOverlay.classList.remove('active');
    addTaskOverlay.classList.add('closing');

    addTaskOverlay.addEventListener('transitionend', function handler(e) {
        if (e.target.id === 'content-section') {
            addTaskOverlay.classList.add('d_none');
            addTaskOverlay.classList.remove('closing');
            addTaskOverlay.removeEventListener('transitionend', handler);
        }
    });
}

// Schließen über X
closeBtn.addEventListener('click', addTaskOverlayClose);
 const ToDo = document.getElementById('todo-tiles');
 const InProgress = document.getElementById('progress-tiles');
 const Awaiting = document.getElementById('feedback-tiles');
 const Done = document.getElementById('done-tiles');
 let currentDraggedElement;
 //const BASE_URL = 'https://join-ad1a9-default-rtdb.europe-west1.firebasedatabase.app/';



window.addEventListener("tasksLoaded", () => {
    updateBoard();
});

function updateBoard() {
    let statuses = ['ToDo', 'InProgress', 'Awaiting', 'Done'];
    statuses.forEach(status => {
        let filteredTasks = tasks.filter(t => t['taskgroup'] == status);
        
        let container = document.getElementById(status);
        container.innerHTML = '';

        if (filteredTasks.length === 0) {
            container.innerHTML = `<p class="no-tasks-message">No tasks in this category.</p>`;
            return;
        }

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
    updateBoard();
}

function openTaskCardOverlay(taskId) {
    const task = tasks.find(t => t.id === taskId);

    let overlay = document.getElementById('task_card_overlay');

    overlay.classList.remove('d_none');

    setTimeout(() => {
        overlay.classList.remove('closing');
        overlay.classList.add('active');
    }, 10);

    overlay.innerHTML = generateOpenedTaskCardHTML(task);

    console.log(task);
}


function closeTaskCardOverlay() {
    const overlay = document.getElementById('task_card_overlay');

    overlay.classList.add('closing');

    setTimeout(() => {
        overlay.classList.remove('active', 'closing');
        overlay.innerHTML = '';
    }, 400); // exakt zur transform-duration
}

function stopPropagation(event) {
  event.stopPropagation(event);
}