
// Replace your API, Auth value and ID with your firebase values
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
});

const db = firebase.firestore();
const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

function renderTask(task) {
  const li = document.createElement('li');
  li.className = 'flex justify-between items-center bg-white rounded-md px-4 py-2';
  li.innerHTML = `
    <span>${task.description}</span>
    <button class="bg-red-500 text-white rounded px-3 py-1 hover:bg-red-600 transition duration-200">Delete</button>
  `;
  const deleteButton = li.querySelector('button');
  deleteButton.addEventListener('click', async () => {
    try {
      await db.collection('tasks').doc(task.id).delete();
      li.remove();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  });

  taskList.appendChild(li);
}

async function loadTasks() {
  taskList.innerHTML = '';

  try {
    const snapshot = await db.collection('tasks').get();
    snapshot.forEach((doc) => {
      const task = {
        id: doc.id,
        description: doc.data().description,
      };
      renderTask(task);
    });
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

// Function to add a new task
async function addTask(description) {
  try {
    const docRef = await db.collection('tasks').add({ description });
    const task = {
      id: docRef.id,
      description,
    };
    renderTask(task);
  } catch (error) {
    console.error('Error adding task:', error);
  }
}

// Event listener for form submission
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const description = taskInput.value.trim();
  if (description !== '') {
    addTask(description);
    taskInput.value = '';
    taskInput.focus();
  }
});

window.addEventListener('DOMContentLoaded', () => {
  loadTasks();
});
