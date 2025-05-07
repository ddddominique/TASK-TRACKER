console.log("JavaScript file is linked correctly!");
const BASE_URL = "http://127.0.0.1:8000"; // Django runs on port 8000



const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

// ✅ Fetch existing tasks from Django API when the page loads
async function fetchTasks() {
    const response = await fetch(`${BASE_URL}/api/tasks/`);
    if (response.ok) {
        const tasks = await response.json();
        tasks.forEach(addTaskToDOM);
    }
}

// ✅ Function to add a task to the DOM
function addTaskToDOM(task) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item", "list-group-item", "d-flex", "justify-content-between", "align-items-center");
    if (task.completed) taskItem.classList.add("completed");

    // Create a checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task-checkbox");
    checkbox.checked = task.completed;

    // Display task text
    const taskTextSpan = document.createElement("span");
    taskTextSpan.textContent = task.title;

    const taskTextWrapper = document.createElement("div");

    const taskTitle = document.createElement("strong");
    taskTitle.textContent = task.title;
    
    const taskDesc = document.createElement("p");
    taskDesc.textContent = task.description;
    taskDesc.classList.add("text-muted", "mb-0"); // optional Bootstrap class
    
    taskTextWrapper.appendChild(taskTitle);
    taskTextWrapper.appendChild(taskDesc);
    
    // Create a delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.classList.add("delete-btn");

    // Toggle completion when the checkbox is clicked
    checkbox.addEventListener("click", async function () {
        task.completed = checkbox.checked;

        const response = await fetch(`${BASE_URL}/api/tasks/${task.id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ completed: task.completed })
        });

        if (response.ok) {
            if (task.completed) {
                taskItem.classList.add("completed");
            } else {
                taskItem.classList.remove("completed");
            }
        } else {
            console.error("Failed to update task");
        }
    });

    // Delete task when delete button is clicked
    deleteBtn.addEventListener("click", async function () {
        const response = await fetch(`${BASE_URL}/api/tasks/${task.id}/`, { method: "DELETE" });
        if (response.ok) {
            taskItem.classList.add("fade-out");
            setTimeout(() => taskItem.remove(), 300); // Remove after animation ends
        } else {
            console.error("Failed to delete task");
        }
    });

    // Add elements to task item
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskTextWrapper);
    taskItem.appendChild(deleteBtn);
    taskList.appendChild(taskItem); // Add task item to task list
}




// ✅ Handle new task submission
taskForm.addEventListener("submit", async function (event) {
    event.preventDefault();  // Prevent the default form submission

    const taskInput = document.getElementById("task-input");
    const taskDescription = document.getElementById("task-description");
    const taskCompleted = document.getElementById("task-completed");

    const taskText = taskInput.value.trim();
    const taskDesc = taskDescription.value.trim();
    const isCompleted = taskCompleted.checked;

    if (taskText !== "") {
        // Make sure to update the URL to your Django backend API endpoint
        const response = await fetch("http://127.0.0.1:8000/api/tasks/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: taskText,        // Required
                description: taskDesc,  // Optional
                completed: isCompleted  // Required
            })
        });

        if (response.ok) {
            const newTask = await response.json();
            addTaskToDOM(newTask);  // Add the new task to the DOM
            taskInput.value = "";    // Clear input field after adding task
            taskDescription.value = "";  // Clear description field
            taskCompleted.checked = false; // Uncheck the completed checkbox
        } else {
            console.error("Failed to add task");
        }
    }
});



// ✅ Load tasks when the page loads
fetchTasks();
