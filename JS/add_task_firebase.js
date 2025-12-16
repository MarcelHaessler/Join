const BASE_URL = 'https://join-ad1a9-default-rtdb.europe-west1.firebasedatabase.app/';

async function uploadTask(taskTitle, taskDescription, taskDueDate, taskPriority, taskCategory, taskAssignments, taskSubtasks) {
  let task = createTaskObject(taskTitle, taskDescription, taskDueDate, taskPriority, taskCategory, taskAssignments, taskSubtasks);

  await fetch(`${BASE_URL}/tasks.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  });

  console.log('Task succesfully uploaded');
}