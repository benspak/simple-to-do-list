const taskList = document.getElementById('task-list');
const newTaskInput = document.getElementById('new-task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const exportCsvBtn = document.getElementById('export-csv-btn');

const icons = {
    incomplete: 'icons/Incomplete.svg',
    completed: 'icons/Completed.svg',
    edit: 'icons/EditIcon.svg',
    delete: 'icons/Delete.svg'
};

let tasks = [];

function loadTasks() {
    chrome.storage.local.get(['tasks'], function(result) {
        tasks = result.tasks || [];
        renderTasks();
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

        const taskText = document.createElement('span');
        taskText.textContent = task.text;
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
        taskItem.appendChild(taskText);
        taskItem.appendChild(editIcon);
        taskItem.appendChild(deleteIcon);
        taskList.appendChild(taskItem);
    });
}

function addTask() {
    const newTaskText = newTaskInput.value.trim();
    if (newTaskText !== '') {
        tasks.push({text: newTaskText, completed: false});
        newTaskInput.value = '';
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
    const activeTasks = tasks.filter(task => !task.completed);
    let csvContent = "data:text/csv;charset=utf-8,Active Tasks\n";
    activeTasks.forEach(task => {
        csvContent += `${task.text}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'active_tasks.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

addTaskBtn.onclick = addTask;
exportCsvBtn.onclick = exportToCSV;

document.addEventListener('DOMContentLoaded', loadTasks);
