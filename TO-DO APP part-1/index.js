const searchInput = document.getElementById('search-input');
const taskInput = document.getElementById('task-input');
const durationInput = document.getElementById('duration-input');
const addBtn = document.querySelector(".inputField button");
const todoList = document.querySelector(".todoList");
const deleteAllBtn = document.querySelector(".footer button");
const prioritySelect = document.getElementById("priority-select");
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

taskInput.onkeyup = () => {
    let userEnteredValue = taskInput.value;
    if (userEnteredValue.trim() != 0) {
        addBtn.classList.add("active");
    } else {
        addBtn.classList.remove("active");
    }
}

addBtn.onclick = () => {
    let userEnteredValue = taskInput.value;
    let durationValue = durationInput.value;
    let priority = prioritySelect.value;
    if (userEnteredValue.trim() === "") return; // Avoid empty tasks
    let getLocalStorageData = localStorage.getItem("New Todo");
    if (getLocalStorageData == null) {
        listArray = [];
    } else {
        listArray = JSON.parse(getLocalStorageData);
    }
    listArray.push({ text: userEnteredValue, duration: durationValue, priority: priority });
    localStorage.setItem("New Todo", JSON.stringify(listArray));
    showTasks();
    addBtn.classList.remove("active");
    taskInput.value = ""; 
    durationInput.value = ""; 
}

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
                </div>
            </li>`;
    });
    todoList.innerHTML = newLiTag;
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

    // Reorder listArray based on drag-and-drop
    let draggedElement = listArray[draggedElementIndex];
    listArray.splice(draggedElementIndex, 1);
    listArray.splice(targetElementIndex, 0, draggedElement);

    // Update localStorage and display tasks
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
        listArray[editIndex] = { text: updatedValue, duration: updatedDuration, priority: updatedPriority };
        localStorage.setItem("New Todo", JSON.stringify(listArray));
        showTasks();
        modal.style.display = "none";
    }
}

function deleteTask(index) {
    let getLocalStorageData = localStorage.getItem("New Todo");
    listArray = JSON.parse(getLocalStorageData);
    listArray.splice(index, 1);
    localStorage.setItem("New Todo", JSON.stringify(listArray));
    showTasks();
}

deleteAllBtn.onclick = () => {
    listArray = [];
    localStorage.setItem("New Todo", JSON.stringify(listArray));
    showTasks();
}

// Close modal
closeModal.onclick = () => {
    modal.style.display = "none";
}

// Close modal when clicking outside of it
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Search tasks
searchInput.addEventListener('input', (e) => {
    const searchValue = e.target.value.toLowerCase();
    const tasks = listArray.filter((task) => {
        return task.text.toLowerCase().includes(searchValue);
    });
    showTasks(tasks);
});

// Dark mode toggle
darkModeToggle.onclick = () => {
    document.body.classList.toggle('dark-mode');
}
showTasks();
addBtn.onclick = () => {
    let userEnteredValue = taskInput.value;
    let durationValue = durationInput.value;
    let priority = prioritySelect.value;
    let dueDateValue = new Date(); // Set the due date accordingly

    if (userEnteredValue.trim() === "") return; // Avoid empty tasks

    let getLocalStorageData = localStorage.getItem("New Todo");
    if (getLocalStorageData == null) {
        listArray = [];
    } else {
        listArray = JSON.parse(getLocalStorageData);
    }

    listArray.push({ text: userEnteredValue, duration: durationValue, priority: priority, dueDate: dueDateValue.toString() });
    localStorage.setItem("New Todo", JSON.stringify(listArray));
    showTasks();
    scheduleNotifications(); // Update notifications
    addBtn.classList.remove("active");
    taskInput.value = ""; 
    durationInput.value = ""; 
}

// Similarly, call scheduleNotifications() after editing tasks
saveEditBtn.onclick = () => {
    let updatedValue = editInput.value;
    let updatedDuration = editDurationInput.value;
    let updatedPriority = editPrioritySelect.value;
    let updatedDueDate = new Date(); // Update the due date accordingly

    if (updatedValue.trim() !== "") {
        listArray[editIndex] = { text: updatedValue, duration: updatedDuration, priority: updatedPriority, dueDate: updatedDueDate.toString() };
        localStorage.setItem("New Todo", JSON.stringify(listArray));
        showTasks();
        scheduleNotifications(); // Update notifications
        modal.style.display = "none";
    }
}

// Call this function whenever the task list is updated
showTasks(); // Initialize display
