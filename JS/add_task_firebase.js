const BASE_URL = 'https://join-ad1a9-default-rtdb.europe-west1.firebasedatabase.app/';
window.tasks = [];

async function uploadTask(taskTitle, taskDescription, taskDueDate, taskPriority, taskCategory, taskgroup, taskAssignments, taskSubtasks) {
  let task = createTaskObject(taskTitle, taskDescription, taskDueDate, taskPriority, taskCategory, taskgroup, taskAssignments, taskSubtasks);

  await fetch(`${BASE_URL}/tasks.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  });

  console.log('Task succesfully uploaded');
}

window.addEventListener("load", async () => {
    await fetchTasks();
    window.dispatchEvent(new Event("tasksLoaded"));
});

async function fetchTasks() {
  tasks = [];
  let response = await fetch("https://join-ad1a9-default-rtdb.europe-west1.firebasedatabase.app/.json");
  let data = await response.json();
  for (let key in data.tasks) {
      if (data.tasks[key]) {   
          tasks.push({
              id: key,
              ...data.tasks[key]});
      }
  }
  // console.log(tasks);
  return tasks;
}
