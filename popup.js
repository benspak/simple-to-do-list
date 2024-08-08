const taskList = document.getElementById('task-list');
const newTaskInput = document.getElementById('new-task-input');
const newTaskDueDateInput = document.getElementById('new-task-due-date');
const addTaskBtn = document.getElementById('add-task-btn');
const exportCsvBtn = document.getElementById('export-csv-btn');

const icons = {
    incomplete: 'Incomplete.svg',
    completed: 'Completed.svg',
    edit: 'EditIcon.svg',
    delete: 'Delete.svg'
};

let tasks = [];

function loadTasks() {
    chrome.storage.local.get(['tasks'], function(result) {
        tasks = result.tasks || [];
        renderTasks();
        checkDueDates();
    });
}

function saveTasks() {
    chrome.storage.local.set({tasks: tasks});
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.className = task.completed ? 'completed' : '';

        const dueDateText = document.createElement('span');
        dueDateText.textContent = task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : '';
        dueDateText.className = 'due-date';

        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        taskText.className = 'task-text';
        taskText.contentEditable = false;

        const completeIcon = document.createElement('img');
        completeIcon.src = task.completed ? icons.completed : icons.incomplete;
        completeIcon.className = 'task-icon';
        completeIcon.onclick = () => toggleTaskComplete(index);

        const editIcon = document.createElement('img');
        editIcon.src = icons.edit;
        editIcon.className = 'task-icon';
        editIcon.onclick = () => editTask(index, taskText);

        const deleteIcon = document.createElement('img');
        deleteIcon.src = icons.delete;
        deleteIcon.className = 'task-icon';
        deleteIcon.onclick = () => deleteTask(index);

        taskItem.appendChild(completeIcon);
        taskItem.appendChild(dueDateText);
        taskItem.appendChild(taskText);
        taskItem.appendChild(editIcon);
        taskItem.appendChild(deleteIcon);
        taskList.appendChild(taskItem);
    });
}

function addTask() {
    const newTaskText = newTaskInput.value.trim();
    const newTaskDueDate = newTaskDueDateInput.value;
    if (newTaskText !== '') {
        tasks.push({text: newTaskText, dueDate: newTaskDueDate, completed: false});
        newTaskInput.value = '';
        newTaskDueDateInput.value = '';
        saveTasks();
        renderTasks();
    }
}

function toggleTaskComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function editTask(index, taskText) {
    taskText.contentEditable = true;
    taskText.focus();
    taskText.onblur = () => {
        tasks[index].text = taskText.textContent;
        taskText.contentEditable = false;
        saveTasks();
    };
}

function deleteTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Task,Due Date,Completed\n";
    tasks.forEach(task => {
        csvContent += `"${task.text.replace(/"/g, '""')}",${task.dueDate ? task.dueDate : ''},${task.completed ? 'Yes' : 'No'}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'tasks.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function checkDueDates() {
    const now = new Date().toISOString();
    tasks.forEach(task => {
        if (task.dueDate && task.dueDate < now && !task.notified) {
            notifyUser(task.text);
            task.notified = true;
            saveTasks();
        }
    });
}

function notifyUser(taskText) {
    if (chrome.notifications) {
        chrome.notifications.create('', {
            title: 'Task Due',
            message: `The task "${taskText}" is now due!`,
            iconUrl: 'icon48.png',
            type: 'basic'
        }, function(notificationId) {});
    } else {
        console.error('Notifications API not available.');
    }
}

addTaskBtn.onclick = addTask;
exportCsvBtn.onclick = exportToCSV;

document.addEventListener('DOMContentLoaded', loadTasks);
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
        addTask();
    }
});
