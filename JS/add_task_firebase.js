import { db } from "./firebaseAuth.js";
import { ref, push, set, get } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";

window.tasks = [];

async function uploadTask(taskTitle, taskDescription, taskDueDate, taskPriority, taskCategory, taskgroup, taskAssignments, taskSubtasks) {
  showLoader();
  let task = createTaskObject(taskTitle, taskDescription, taskDueDate, taskPriority, taskCategory, taskgroup, taskAssignments, taskSubtasks);

  try {
    await saveTaskToFirebase(task);
  } catch (error) {
    saveTaskToLocalStorage(task);
  } finally {
    hideLoader();
  }
}

async function saveTaskToFirebase(task) {
  const tasksRef = ref(db, "tasks");
  const newTaskRef = push(tasksRef);
  await set(newTaskRef, task);
}

function saveTaskToLocalStorage(task) {
  const tasksData = localStorage.getItem('join_tasks');
  const tasks = tasksData ? JSON.parse(tasksData) : [];
  const taskId = 'task_' + Date.now();
  tasks.push({ id: taskId, ...task });
  localStorage.setItem('join_tasks', JSON.stringify(tasks));
}

window.addEventListener("load", async () => {
  if (!window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('registration.html')) {
    await fetchTasks();
    window.dispatchEvent(new Event("tasksLoaded"));
  }
});

async function fetchTasks() {
  showLoader();
  window.tasks = [];
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

async function loadTasksFromFirebase() {
  const tasksRef = ref(db, "tasks");
  const snapshot = await get(tasksRef);

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

function loadTasksFromLocalStorage() {
  const tasksData = localStorage.getItem('join_tasks');
  if (tasksData) {
    tasks = JSON.parse(tasksData);
    window.tasks = tasks;
  }
}

window.uploadTask = uploadTask;
window.fetchTasks = fetchTasks;
