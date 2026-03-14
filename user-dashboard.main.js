// #region Imports
import { USER_CONTROLLER } from './user-controller.js';
// #endregion Imports

// #region Constants
const LOADING_CONTAINER = document.getElementById('loading-container');
const ERROR_CONTAINER = document.getElementById('error-container');
const USER_CONTAINER = document.getElementById('user-container');
// #endregion Constants

// #region Variables
const todosMap = new Map();
// #endregion Variables

// #region Main
async function initUserDashboard() {
  try {
    const userSummary = await USER_CONTROLLER.prepUserSummary();
    userSummary.forEach((user) => {
      const card = document.createElement('div');
      card.className = 'user-card';
      const header = document.createElement('div');
      header.className = 'user-header';
      const chevron = document.createElement('span');
      chevron.className = 'chevron';
      chevron.innerHTML = '▶';
      const title = document.createElement('div');
      title.innerHTML = `
        <strong>${user.name}</strong>
        (Posts: ${user.totalPosts}, Cart: $${user.cartTotal})
      `;
      header.appendChild(title);
      header.appendChild(chevron);
      const details = document.createElement('div');
      details.className = 'user-details';
      header.addEventListener('click', async () => {
        const expand = details.style.display === 'block';
        if (expand) {
          details.style.display = 'none';
          chevron.classList.remove('expand');
          return;
        }
        details.style.display = 'block';
        chevron.classList.add('expand');
        if (details.dataset.loaded) return;
        details.innerHTML = 'Loading todos...';
        try {
          const todos = await getTodos(user.id);
          details.innerHTML = '';
          todos.forEach((todo) => {
            const row = document.createElement('div');
            row.className = 'todo';
            const statusClass = todo.completed ? 'completed' : 'pending';
            const statusText = todo.completed ? 'Completed' : 'Pending';
            row.innerHTML = `
              <span>${todo.todo}</span>
              <span class="badge ${statusClass}">${statusText}</span>
            `;
            details.appendChild(row);
          });
          details.dataset.loaded = true;
        } catch {
          details.innerHTML = 'Failed to load todos.';
        }
      });

      card.appendChild(header);
      card.appendChild(details);
      LOADING_CONTAINER.style.display = 'none';
      ERROR_CONTAINER.style.display = 'none';
      USER_CONTAINER.appendChild(card);
    });
  } catch {
    LOADING_CONTAINER.style.display = 'none';
    const errorContent = document.createElement('div');
    errorContent.innerHTML = `Cannot load the User details at the moment. Please try again later or
    contact support for mode details.`;
    ERROR_CONTAINER.appendChild(errorContent);
  }
}
// #endregion Main

async function getTodos(userId) {
  if (todosMap.has(userId)) {
    return todosMap.get(userId);
  }
  const getTodos = await USER_CONTROLLER.getTodosByUser(userId);
  todosMap.set(userId, getTodos.todos);
  return getTodos.todos;
}
// #endregion Main

// Main Entry
initUserDashboard();
