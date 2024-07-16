document.addEventListener('DOMContentLoaded', () => {
  const archivedList = document.getElementById('archived-list');
  const exportArchivedButton = document.getElementById('export-archived');
  const clearArchivedButton = document.getElementById('clear-archived');

  const loadArchivedTasks = () => {
    chrome.storage.local.get('archivedTasks', (data) => {
      archivedList.innerHTML = '';
      if (data.archivedTasks) {
        data.archivedTasks.forEach((task, index) => {
          const li = document.createElement('li');
          li.innerHTML = `
            <span>${task.text}</span>
            <button class="restore-task" data-index="${index}">Restore</button>
          `;
          archivedList.appendChild(li);

          li.querySelector('.restore-task').addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            chrome.storage.local.get(['tasks', 'archivedTasks'], (data) => {
              const task = data.archivedTasks.splice(index, 1)[0];
              const tasks = data.tasks || [];
              tasks.push(task);
              chrome.storage.local.set({ tasks, archivedTasks: data.archivedTasks });
              loadArchivedTasks();
            });
          });
        });
      }
    });
  };

  const exportToCSV = () => {
    chrome.storage.local.get('archivedTasks', (data) => {
      if (data.archivedTasks) {
        const csvContent = 'data:text/csv;charset=utf-8,Task\n' + data.archivedTasks.map(task => task.text).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'archived_tasks.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  const clearArchivedTasks = () => {
    chrome.storage.local.set({ archivedTasks: [] }, loadArchivedTasks);
  };

  exportArchivedButton.addEventListener('click', exportToCSV);
  clearArchivedButton.addEventListener('click', clearArchivedTasks);

  loadArchivedTasks();
});
