document.addEventListener('DOMContentLoaded', function () {
  const newTodoInput = document.getElementById('new-todo');
  const addTodoButton = document.getElementById('add-todo');
  const todoList = document.getElementById('todo-list');
  const archiveView = document.getElementById('archive');
  const mainView = document.getElementById('main');
  const archivedList = document.getElementById('archived-list');
  const exportTodoButton = document.getElementById('export-todo');
  const viewArchivedButton = document.getElementById('view-archived');
  const exportArchivedButton = document.getElementById('export-archived');
  const backToMainButton = document.getElementById('back-to-main');

  addTodoButton.addEventListener('click', addTodo);
  viewArchivedButton.addEventListener('click', () => {
    mainView.style.display = 'none';
    archiveView.style.display = 'block';
    loadArchivedTodos();
  });
  backToMainButton.addEventListener('click', () => {
    mainView.style.display = 'block';
    archiveView.style.display = 'none';
  });
  exportTodoButton.addEventListener('click', exportActiveTasks);
  exportArchivedButton.addEventListener('click', exportArchivedTasks);

  function addTodo() {
    const task = newTodoInput.value.trim();
    if (task) {
      const todo = { id: Date.now(), task, archived: false };
      chrome.storage.local.get({ todos: [] }, function (result) {
        const todos = result.todos;
        todos.push(todo);
        chrome.storage.local.set({ todos }, () => loadTodos(todos));
      });
      newTodoInput.value = '';
    }
  }

  function loadTodos(todos) {
    todoList.innerHTML = '';
    todos.filter(todo => !todo.archived).forEach(todo => {
      const li = document.createElement('li');
      li.textContent = todo.task;
      li.id = todo.id;
      const archiveButton = document.createElement('button');
      archiveButton.textContent = 'Archive';
      archiveButton.addEventListener('click', () => archiveTask(todo.id));
      li.appendChild(archiveButton);
      todoList.appendChild(li);
    });
  }

  function loadArchivedTodos() {
    chrome.storage.local.get({ todos: [] }, function (result) {
      archivedList.innerHTML = '';
      result.todos.filter(todo => todo.archived).forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo.task;
        li.id = todo.id;
        const restoreButton = document.createElement('button');
        restoreButton.textContent = 'Restore';
        restoreButton.addEventListener('click', () => restoreTask(todo.id));
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(todo.id));
        li.appendChild(restoreButton);
        li.appendChild(deleteButton);
        archivedList.appendChild(li);
      });
    });
  }

  function archiveTask(id) {
    chrome.storage.local.get({ todos: [] }, function (result) {
      const todos = result.todos.map(todo => {
        if (todo.id === id) todo.archived = true;
        return todo;
      });
      chrome.storage.local.set({ todos }, () => loadTodos(todos));
    });
  }

  function restoreTask(id) {
    chrome.storage.local.get({ todos: [] }, function (result) {
      const todos = result.todos.map(todo => {
        if (todo.id === id) todo.archived = false;
        return todo;
      });
      chrome.storage.local.set({ todos }, () => loadArchivedTodos());
    });
  }

  function deleteTask(id) {
    chrome.storage.local.get({ todos: [] }, function (result) {
      const todos = result.todos.filter(todo => todo.id !== id);
      chrome.storage.local.set({ todos }, () => loadArchivedTodos());
    });
  }

  function exportActiveTasks() {
    chrome.storage.local.get({ todos: [] }, function (result) {
      const tasks = result.todos.filter(todo => !todo.archived);
      downloadCSV(tasks, 'active_tasks.csv');
    });
  }

  function exportArchivedTasks() {
    chrome.storage.local.get({ todos: [] }, function (result) {
      const tasks = result.todos.filter(todo => todo.archived);
      downloadCSV(tasks, 'archived_tasks.csv');
    });
  }

  function downloadCSV(tasks, filename) {
    const csvContent = 'data:text/csv;charset=utf-8,'
      + tasks.map(e => e.task).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  chrome.storage.local.get({ todos: [] }, function (result) {
    loadTodos(result.todos);
  });
});
