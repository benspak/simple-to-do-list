document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('new-task');
  const addTaskButton = document.getElementById('add-task');
  const taskList = document.getElementById('task-list');
  const exportActiveButton = document.getElementById('export-active');
  const viewArchivedButton = document.getElementById('view-archived');

  const saveTasks = (tasks) => {
    chrome.storage.local.set({ tasks });
  };

  const saveArchivedTasks = (archivedTasks) => {
    chrome.storage.local.set({ archivedTasks });
  };

  const loadTasks = () => {
    chrome.storage.local.get(['tasks', 'archivedTasks'], (data) => {
      taskList.innerHTML = '';
      if (data.tasks) {
        data.tasks.forEach((task, index) => {
          addTaskToList(task, index);
        });
      }
    });
  };

  const addTaskToList = (task, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="task-text">${task.text}</span>
      <button class="edit-task" data-index="${index}">Edit</button>
      <button class="archive-task" data-index="${index}">Archive</button>
    `;
    taskList.appendChild(li);

    li.querySelector('.edit-task').addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      const newTaskText = prompt('Edit task:', task.text);
      if (newTaskText !== null) {
        chrome.storage.local.get('tasks', (data) => {
          data.tasks[index].text = newTaskText;
          saveTasks(data.tasks);
          loadTasks();
        });
      }
    });

    li.querySelector('.archive-task').addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      chrome.storage.local.get(['tasks', 'archivedTasks'], (data) => {
        const task = data.tasks.splice(index, 1)[0];
        const archivedTasks = data.archivedTasks || [];
        archivedTasks.push(task);
        saveTasks(data.tasks);
        saveArchivedTasks(archivedTasks);
        loadTasks();
      });
    });
  };

  addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
      chrome.storage.local.get('tasks', (data) => {
        const tasks = data.tasks || [];
        tasks.push({ text: taskText });
        saveTasks(tasks);
        taskInput.value = '';
        loadTasks();
      });
    }
  });

  exportActiveButton.addEventListener('click', () => {
    chrome.storage.local.get('tasks', (data) => {
      if (data.tasks) {
        const csvContent = 'data:text/csv;charset=utf-8,Task\n' + data.tasks.map(task => task.text).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'active_tasks.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  });

  viewArchivedButton.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('archived.html') });
  });

  loadTasks();
});

// Check daily active user whenever the extension's popup is opened
document.addEventListener('DOMContentLoaded', function() {
  checkDailyActiveUser();
});
