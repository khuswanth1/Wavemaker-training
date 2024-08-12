const searchInput = document.getElementById('search-input');
const taskInput = document.getElementById('task-input');
const durationInput = document.getElementById('durationField');
const addBtn = document.querySelector(".inputField button");
const todoList = document.querySelector(".todoList");
const deleteAllBtn = document.querySelector(".footer #clear-all-btn");
const prioritySelect = document.getElementById("priorityselect");
const subtaskModal = document.getElementById('subtaskModal');
const addSubtaskBtn = document.getElementById('addSubtaskBtn');
const subtaskInput = document.getElementById('subtask-input');
const subtaskList = document.getElementById('subtask-list');
const saveSubtasksBtn = document.getElementById('saveSubtasksBtn');
const modal = document.getElementById("editModal");
const closeModal = document.querySelector(".close");
const editInput = document.getElementById("editInput");
const editDurationInput = document.getElementById("editDurationInput");
const editPrioritySelect = document.getElementById("editPrioritySelect");
const saveEditBtn = document.getElementById("saveEditBtn");
const darkModeToggle = document.getElementById("dark-mode-toggle");

let listArray = [];
let editIndex = null; 
let draggedElementIndex = null;
let currentTaskIndex = null;

taskInput.onkeyup = () => {
    let userEnteredValue = taskInput.value;
    if (userEnteredValue.trim() != 0) {
        addBtn.classList.add("active");
    } else {
        addBtn.classList.remove("active");
    }
};

addBtn.onclick = () => {
    let userEnteredValue = taskInput.value;
    let durationValue = durationInput.value;
    let priority = prioritySelect.value;
    if (userEnteredValue.trim() === "") return;
    let getLocalStorageData = localStorage.getItem("New Todo");
    if (getLocalStorageData == null) {
        listArray = [];
    } else {
        listArray = JSON.parse(getLocalStorageData);
    }
    listArray.push({ text: userEnteredValue, duration: durationValue, priority: priority, subtasks: [] });
    localStorage.setItem("New Todo", JSON.stringify(listArray));
    showTasks();
    addBtn.classList.remove("active");
    taskInput.value = "";
    durationInput.value = "";
};

function showTasks(filteredTasks = listArray) {
    let getLocalStorageData = localStorage.getItem("New Todo");
    if (getLocalStorageData == null) {
        listArray = [];
    } else {
        listArray = JSON.parse(getLocalStorageData);
    }
    const pendingTasksNumb = document.querySelector(".pendingTasks");
    pendingTasksNumb.textContent = listArray.length;
    if (listArray.length > 0) {
        deleteAllBtn.classList.add("active");
    } else {
        deleteAllBtn.classList.remove("active");
    }
    let newLiTag = "";
    filteredTasks.forEach((element, index) => {
        newLiTag += 
            `<li class="${element.priority}-priority" data-index="${index}" draggable="true" ondragstart="dragStart(event)" ondragover="dragOver(event)" ondrop="drop(event)" ondragend="dragEnd(event)">
                <div class="task-details">
                    <span>${element.text}</span>
                    <span class="task-duration">${element.duration}</span>
                </div>
                <span class="ellipsis" onclick="toggleDropdown(event, ${index})"><i class="fas fa-ellipsis-h"></i></span>
                <div class="dropdown" id="dropdown-${index}">
                    <a href="#" onclick="editTask(${index})">Edit</a>
                    <a href="#" onclick="deleteTask(${index})">Delete</a>
                    <a href="#" onclick="openSubtaskModal(${index})">Subtasks</a>
                </div>
            </li>`;
    });
    todoList.innerHTML = newLiTag;
}

function openSubtaskModal(index) {
    currentTaskIndex = index;
    subtaskList.innerHTML = '';
    const task = listArray[index];
    task.subtasks.forEach(subtask => {
        const listItem = document.createElement('li');
        listItem.textContent = subtask;
        subtaskList.appendChild(listItem);
    });
    subtaskModal.style.display = "block";
}

function closeSubtaskModal() {
    subtaskModal.style.display = "none";
}

addSubtaskBtn.onclick = () => {
    const newSubtask = subtaskInput.value.trim();
    if (newSubtask) {
        const listItem = document.createElement('li');
        listItem.textContent = newSubtask;
        subtaskList.appendChild(listItem);
        subtaskInput.value = '';
    } else {
        alert('Please enter a subtask.');
    }
};

saveSubtasksBtn.onclick = () => {
    const subtasks = Array.from(subtaskList.children).map(li => li.textContent);
    listArray[currentTaskIndex].subtasks = subtasks;
    localStorage.setItem("New Todo", JSON.stringify(listArray));
    showTasks();
    closeSubtaskModal();
};

function editTask(index) {
    editIndex = index;
    let task = listArray[index];
    editInput.value = task.text;
    editDurationInput.value = task.duration;
    editPrioritySelect.value = task.priority;
    modal.style.display = "block";
}

saveEditBtn.onclick = () => {
    let updatedValue = editInput.value;
    let updatedDuration = editDurationInput.value;
    let updatedPriority = editPrioritySelect.value;
    if (updatedValue.trim() !== "") {
        listArray[editIndex] = { text: updatedValue, duration: updatedDuration, priority: updatedPriority, subtasks: listArray[editIndex].subtasks };
        localStorage.setItem("New Todo", JSON.stringify(listArray));
        showTasks();
        modal.style.display = "none";
    }
};

function deleteTask(index) {
    listArray.splice(index, 1);
    localStorage.setItem("New Todo", JSON.stringify(listArray));
    showTasks();
}

function dragStart(event) {
    draggedElementIndex = event.target.getAttribute('data-index');
    event.target.style.opacity = 0.5;
}

function dragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

function drop(event) {
    event.preventDefault();
    let targetElementIndex = event.target.closest('li').getAttribute('data-index');
    if (draggedElementIndex === targetElementIndex) return;

    let draggedElement = listArray[draggedElementIndex];
    listArray.splice(draggedElementIndex, 1);
    listArray.splice(targetElementIndex, 0, draggedElement);

    localStorage.setItem("New Todo", JSON.stringify(listArray));
    showTasks();
}

function dragEnd(event) {
    event.target.style.opacity = "";
}

function toggleDropdown(event, index) {
    const dropdown = document.getElementById(`dropdown-${index}`);
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    event.stopPropagation();
}

function deleteAllTasks() {
    listArray = [];
    localStorage.setItem("New Todo", JSON.stringify(listArray));
    showTasks();
}

deleteAllBtn.onclick = deleteAllTasks;

closeModal.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

searchInput.addEventListener('input', (e) => {
    const searchValue = e.target.value.toLowerCase();
    const tasks = listArray.filter((task) => {
        return task.text.toLowerCase().includes(searchValue) ||
               task.subtasks.some(subtask => subtask.toLowerCase().includes(searchValue));
    });
    showTasks(tasks);
});

darkModeToggle.onclick = () => {
    document.body.classList.toggle('dark-mode');
};

showTasks();

if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}

function showNotification(task) {
    if (Notification.permission === 'granted') {
        new Notification('Task Deadline Approaching', {
            body: `The deadline for task "${task.text}" is approaching!`,
            icon: 'path/to/icon.png' 
        });
    }
}

function checkDeadlines(tasks) {
    const now = new Date();

    tasks.forEach(task => {
        const deadline = new Date(task.duration);
        const timeRemaining = deadline - now;
        const notificationThreshold = 60 * 60 * 1000; // 1 hour in milliseconds

        if (timeRemaining <= notificationThreshold && timeRemaining > 0) {
            const waitTime = timeRemaining > 0 ? timeRemaining : 0;
            setTimeout(() => showNotification(task), waitTime);
        }
    });
}

checkDeadlines(listArray);
