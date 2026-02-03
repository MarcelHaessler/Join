import { db } from "./firebaseAuth.js";
import { ref, push, set, get } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";

window.tasks = [];

async function uploadTask(taskTitle, taskDescription, taskDueDate, taskPriority, taskCategory, taskgroup, taskAssignments, taskSubtasks) {
  showLoader();
  let task = createTaskObject(taskTitle, taskDescription, taskDueDate, taskPriority, taskCategory, taskgroup, taskAssignments, taskSubtasks);

  try {
    const tasksRef = ref(db, "tasks");
    const newTaskRef = push(tasksRef);
    await set(newTaskRef, task);
  } catch (error) {
    const tasksData = localStorage.getItem('join_tasks');
    const tasks = tasksData ? JSON.parse(tasksData) : [];
    const taskId = 'task_' + Date.now();
    tasks.push({ id: taskId, ...task });
    localStorage.setItem('join_tasks', JSON.stringify(tasks));
  } finally {
    hideLoader();
  }
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
    const tasksRef = ref(db, "tasks");
    const snapshot = await get(tasksRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      for (let key in data) {
        if (data[key]) {
          tasks.push({
            id: key,
            ...data[key]
          });
        }
      }
      window.tasks = tasks;
    }
  } catch (error) {
    const tasksData = localStorage.getItem('join_tasks');
    if (tasksData) {
      tasks = JSON.parse(tasksData);
      window.tasks = tasks;
    }
  } finally {
    hideLoader();
  }
  return tasks;
}

window.uploadTask = uploadTask;
window.fetchTasks = fetchTasks;
