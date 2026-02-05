/**
 * Global array storing all tasks
 * @type {Array<Object>}
 */
var tasks = [];

/**
 * Uploads a new task to Firebase or localStorage
 * @async
 * @param {string} taskTitle - The task title
 * @param {string} taskDescription - The task description
 * @param {string} taskDueDate - The task due date
 * @param {string} taskPriority - The task priority level
 * @param {string} taskCategory - The task category
 * @param {string} taskGroup - The board group (ToDo, InProgress, etc.)
 * @param {Array} taskAssignments - Array of assigned persons
 * @param {Array} taskSubtasks - Array of subtasks
 * @returns {Promise<void>}
 */
async function uploadTask(taskTitle, taskDescription, taskDueDate, taskPriority, taskCategory, taskGroup, taskAssignments, taskSubtasks) {
  showLoader();
  let task = createTaskObject(taskTitle, taskDescription, taskDueDate, taskPriority, taskCategory, taskGroup, taskAssignments, taskSubtasks);

  try {
    await saveTaskToFirebase(task);
  } catch (error) {
    saveTaskToLocalStorage(task);
  } finally {
    hideLoader();
  }
}

/**
 * Saves a task to Firebase database
 * @async
 * @param {Object} task - The task object to save
 * @returns {Promise<void>}
 */
async function saveTaskToFirebase(task) {
  const tasksRef = db.ref("tasks");
  const newTaskRef = tasksRef.push();
  await newTaskRef.set(task);
}

/**
 * Saves a task to localStorage as fallback
 * @param {Object} task - The task object to save
 * @returns {void}
 */
function saveTaskToLocalStorage(task) {
  const tasksData = localStorage.getItem('join_tasks');
  const tasks = tasksData ? JSON.parse(tasksData) : [];
  const taskId = 'task_' + Date.now();
  tasks.push({ id: taskId, ...task });
  localStorage.setItem('join_tasks', JSON.stringify(tasks));
}

/**
 * Initializes event listeners for task management
 * Listens for page load and fetches tasks from Firebase or localStorage
 * Excludes index.html and registration.html pages
 * @returns {void}
 */
function initTaskEventListeners() {
  addEventListener("load", async () => {
    if (!window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('registration.html')) {
      await fetchTasks();
      dispatchEvent(new Event("tasksLoaded"));
    }
  });
}

initTaskEventListeners();

/**
 * Fetches all tasks from Firebase or localStorage
 * @async
 * @returns {Promise<Array>} Array of all tasks
 */
async function fetchTasks() {
  showLoader();
  tasks = [];
  
  try {
    await loadTasksFromFirebase();
  } catch (error) {
    loadTasksFromLocalStorage();
  } finally {
    hideLoader();
  }
  return tasks;
}

/**
 * Loads tasks from Firebase database
 * @async
 * @returns {Promise<void>}
 */
async function loadTasksFromFirebase() {
  const tasksRef = db.ref("tasks");
  const snapshot = await tasksRef.get();

  if (snapshot.exists()) {
    const data = snapshot.val();
    for (let key in data) {
      if (data[key]) {
        tasks.push({ id: key, ...data[key] });
      }
    }
    window.tasks = tasks;
  }
}

/**
 * Loads tasks from localStorage as fallback
 * @returns {void}
 */
function loadTasksFromLocalStorage() {
  const tasksData = localStorage.getItem('join_tasks');
  if (tasksData) {
    tasks = JSON.parse(tasksData);
  }
}
