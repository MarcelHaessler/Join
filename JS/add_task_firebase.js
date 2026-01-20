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
    console.log("Task uploaded successfully with ID:", newTaskRef.key);
  } catch (error) {
    console.error("Error uploading task:", error);
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
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  } finally {
    hideLoader();
  }
  return tasks;
}

window.uploadTask = uploadTask;
window.fetchTasks = fetchTasks;
