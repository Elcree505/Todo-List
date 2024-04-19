const form = document.getElementById("addForm");

// Create two seperates Todo lists
const unfinishedList = document.getElementById("unfinishedTodo");
const finishedList = document.getElementById("finishedTodo");

const filter = document.getElementById("filter");
const textInput = document.getElementById("todo");

// Boostraps alert
const alertContainer = document.getElementById("alertContainer");

// Form submit event
form.addEventListener("submit", addTodo);

// Finish Todo event
unfinishedList.addEventListener("click", finishTodo);

// Unfinish Todo event
finishedList.addEventListener("click", undoTodo);

// Delete event
unfinishedList.addEventListener("click", removeTodo);
finishedList.addEventListener("click", removeTodo);

// Edit Todo event
unfinishedList.addEventListener("click", editTodo);
finishedList.addEventListener("click", editTodo);

// Filter event
filter.addEventListener("keyup", filterTodo);

/**
 * Check if the Todo is empty or already exists
 * @param {string} newTodo - The new Todo to check
 * @returns {boolean} - Returns false if the Todo is empty or already exists, true otherwise
 */
function checkTodo(newTodo) {
    // Check if the Todo is empty
    if (newTodo.trim() === "") {
        createBootstrapAlert(alertContainer, "Todo cannot be empty", "custom");
        return false;
    }

    // Check if the Todo already exists
    let checkUnfinished = Array.from(unfinishedList.getElementsByTagName("li"));
    let checkFinished = Array.from(finishedList.getElementsByTagName("li"));
    let checkAllTodos = checkUnfinished.concat(checkFinished);

    for (let i = 0; i < checkAllTodos.length; i++) {
        if (
            checkAllTodos[i].firstChild.nodeValue.trim() ===
            newTodo.toLowerCase()
        ) {
            createBootstrapAlert(
                alertContainer,
                "Todo already exists",
                "custom"
            );
            return false;
        }
    }

    return true;
}

/**
 * Update the count of Todo in the unfinished and finished lists
 */
function countTodo() {
    const unfinishedTodo = unfinishedList.getElementsByTagName("li").length;
    const finishedTodo = finishedList.getElementsByTagName("li").length;

    // Get the elements where the counts will be displayed
    let unfinishedCount = document.getElementById("unfinishedCount");
    let finishedCount = document.getElementById("finishedCount");

    // Update the counts
    unfinishedCount.textContent = unfinishedTodo;
    finishedCount.textContent = finishedTodo;
}

/**
 * Add a new Todo to the unfinished list
 * @param {Event} e - The event object
 */
function addTodo(e) {
    e.preventDefault();

    // Get input values
    let newTodo = document.getElementById("todo").value;

    // Check if the Todo is empty
    if (!checkTodo(newTodo)) {
        textInput.value = "";
        return;
    }

    let li = document.createElement("li");
    li.className = "list-group-todo";

    // Add text node with input value
    li.appendChild(document.createTextNode(newTodo));

    // Create updated time span (initially not displayed)
    let updatedTimeSpan = document.createElement("span");
    updatedTimeSpan.className = "badge badge-info updated-time";
    updatedTimeSpan.textContent = "N/A";
    li.appendChild(updatedTimeSpan);

    // Create creation time span
    let createTimeSpan = document.createElement("span");
    createTimeSpan.className = "badge create-time";
    createTimeSpan.textContent = formatDateTime(new Date());
    li.appendChild(createTimeSpan);

    // create done time span (initially not displayed)
    let doneTimeSpan = document.createElement("span");
    doneTimeSpan.className = "badge done-time";
    doneTimeSpan.textContent = "N/A";
    li.appendChild(doneTimeSpan);

    // Create finish buttons
    let finishBtn = document.createElement("button");

    // Create delete buttons
    let deleteBtn = document.createElement("button");

    // Create edit buttons
    let editBtn = document.createElement("button");

    // Add classes to finish button
    finishBtn.className = "btn btn-done float-right finish";

    // Add classes to delete button
    deleteBtn.className = "btn btn-delete float-right delete";

    // Add classes to edit button
    editBtn.className = "btn btn-primary btn-sm float-left edit";

    // Append finish text node
    finishBtn.appendChild(document.createTextNode("done"));

    // Append delete text node
    deleteBtn.appendChild(document.createTextNode("X"));

    // Append edit text node
    editBtn.appendChild(document.createTextNode("Edit"));

    // Append finish button to li
    li.appendChild(finishBtn);

    // Append delete button to li
    li.appendChild(deleteBtn);

    // Append edit button to li
    li.appendChild(editBtn);

    // Append li to list
    unfinishedList.appendChild(li);

    // Update countTodo
    countTodo();

    // Clear input value
    textInput.value = "";
}

/**
 * Edit an existing Todo in the list
 * @param {Event} e - The event object
 */
function editTodo(e) {
    if (e.target.classList.contains("edit")) {
        let li = e.target.parentElement;
        let text = li.firstChild.textContent;

        // Create an input field for editing
        createInlineEditInput(li, text);
    }
}

/**
 * Creates an inline edit input and save button within a list Todo.
 * @param {HTMLElement} li - The list Todo element that contains the todo Todo.
 * @param {string} text - The current text of the todo Todo to be edited.
 */
function createInlineEditInput(li, text) {
    // Create the container for input and button
    let editContainer = document.createElement("div");
    editContainer.style.display = "flex";
    editContainer.style.alignTodos = "center"; // Align Todos vertically
    editContainer.className = "edit-container"; // Add a class for the container

    // Create the input field
    let input = document.createElement("input");
    input.type = "text";
    input.className = "form-control";
    input.style.flex = "1"; // Input takes up the remaining space
    input.value = text; // Set the current text as the input's value

    // Create the save button
    let saveBtn = document.createElement("button");
    saveBtn.className = "btn btn-success btn-sm";
    saveBtn.textContent = "Save";
    saveBtn.style.marginLeft = "10px"; // Space between the input and the button

    // Add input and button to the container
    editContainer.appendChild(input);
    editContainer.appendChild(saveBtn);

    // Replace the first child of the list Todo with the container
    li.firstChild.replaceWith(editContainer);
    input.focus();

    // Event listener for the save button
    saveBtn.addEventListener("click", function () {
        saveChanges(li, input.value.trim());
    });

    // Optional: Handle the Enter key to save changes
    input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            saveChanges(li, input.value.trim());
        }
    });
}

/**
 * Saves the changes after editing a todo Todo, or reverts if invalid.
 * @param {HTMLElement} li - The list Todo element that contains the todo Todo.
 * @param {string} newText - The new text to replace the existing todo Todo text.
 */
function saveChanges(li, newText) {
    let input = li.querySelector("input"); // Correct way to access the input inside the editContainer
    let originalText = input.value; // This should store the original input value for comparison and fallback

    // Check if the newText is valid and different from the original input
    if (newText && newText !== originalText && checkTodo(newText)) {
        // Create new text node and replace the editContainer with it
        let textNode = document.createTextNode(newText);
        li.querySelector("div").replaceWith(textNode); // Replace the entire container

        // Update the updated time
        let updatedTimeSpan = li.querySelector(".updated-time");
        if (updatedTimeSpan) {
            updatedTimeSpan.textContent = formatDateTime(new Date());
        }
    } else {
        // If not changed or input invalid, revert to old text
        let textNode = document.createTextNode(originalText);
        li.querySelector("div").replaceWith(textNode); // Replace the entire container
    }
}

/**
 * Move an Todo from the unfinished list to the finished list
 * @param {Event} e - The event object
 */
function finishTodo(e) {
    if (e.target.classList.contains("finish")) {
        let li = e.target.parentElement;

        if (!li.classList.contains("finished")) {
            let li = e.target.parentElement;
            li.classList.add("finished");

            let finishBtn = e.target;
            li.removeChild(finishBtn);

            let undoBtn = document.createElement("button");
            undoBtn.className = "btn btn-undo float-right undo";
            undoBtn.appendChild(document.createTextNode("undo"));

            // Find the done time badge and update it
            let doneTimeSpan = li.querySelector(".done-time");
            doneTimeSpan.textContent = formatDateTime(new Date());
            doneTimeSpan.parentNode.insertBefore(
                undoBtn,
                doneTimeSpan.nextSibling
            );

            unfinishedList.removeChild(li);
            finishedList.appendChild(li);
        }

        countTodo();
    }
}

/**
 * Move an Todo from the finished list back to the unfinished list
 * @param {Event} e - The event object
 */
function undoTodo(e) {
    if (e.target.classList.contains("undo")) {
        let li = e.target.parentElement;
        li.style.textDecoration = "none";
        li.classList.remove("finished");

        // Remove the undo button from the Todo
        let undoBtn = e.target;
        li.removeChild(undoBtn);

        // Add a finish button to the Todo
        let finishBtn = document.createElement("button");
        finishBtn.className = "btn btn-done float-right finish";
        finishBtn.appendChild(document.createTextNode("done"));

        // Insert the undo button after the creation time span
        let createTimeSpan = li.querySelector(".badge");
        createTimeSpan.parentNode.insertBefore(
            finishBtn,
            createTimeSpan.nextSibling
        );

        // Find the done time badge and update it
        let doneTimeSpan = li.querySelector(".done-time");
        doneTimeSpan.textContent = "N/A";
        doneTimeSpan.parentNode.insertBefore(
            finishBtn,
            doneTimeSpan.nextSibling
        );

        // Remove the Todo from the finished list and add it to the unfinished list
        finishedList.removeChild(li);
        unfinishedList.appendChild(li);

        // Update count
        countTodo();
    }
}

let currentTodoToDelete = null;

/**
 * Handles the removal of a todo item by displaying a confirmation modal.
 * @param {Event} e - The event object.
 */
function removeTodo(e) {
    if (e.target.classList.contains("delete")) {
        currentTodoToDelete = e.target.parentElement; // Save reference to the li
        const deleteModal = new bootstrap.Modal(
            document.getElementById("deleteConfirmationModal"),
            {
                keyboard: false,
            }
        );
        deleteModal.show(); // Display the modal
    }
}

/**
 * Confirms the deletion of a todo item and removes it from the DOM.
 */
document.getElementById("confirmDelete").addEventListener("click", function () {
    if (currentTodoToDelete) {
        // Remove the todo item from its list
        const list = currentTodoToDelete.parentElement;
        list.removeChild(currentTodoToDelete);
        countTodo(); // Update the todo counts
    }
    // Hide the modal and clear the reference
    const deleteModal = bootstrap.Modal.getInstance(
        document.getElementById("deleteConfirmationModal")
    );
    deleteModal.hide();
    currentTodoToDelete = null;
});

// /**
//  * Remove an Todo from the list
//  * @param {Event} e - The event object
//  */
// function removeTodo(e) {
//     if (e.target.classList.contains("delete")) {
//         if (confirm("Are you sure to delete this Todo?")) {
//             let li = e.target.parentElement;
//             // Check which list the Todo is in
//             if (li.parentElement === unfinishedList) {
//                 unfinishedList.removeChild(li);
//             } else if (li.parentElement === finishedList) {
//                 finishedList.removeChild(li);
//             }

//             // Update the counts
//             countTodo();
//         }
//     }
// }

/**
 * Filter the Todo in the list based on the input text
 * @param {Event} e - The event object
 */
function filterTodo(e) {
    // covert text to lowercase
    let text = e.target.value.toLowerCase();

    // Get list Todos
    let unfinishedTodo = Array.from(unfinishedList.getElementsByTagName("li"));
    let finishedTodo = Array.from(finishedList.getElementsByTagName("li"));
    let todos = unfinishedTodo.concat(finishedTodo);

    // Convert to an array
    Array.from(todos).forEach(function (todo) {
        let todoName = todo.firstChild.textContent;
        if (todoName.toLowerCase().indexOf(text) != -1) {
            todo.style.display = "block";
        } else {
            todo.style.display = "none";
        }
    });
}
/**
 * Formats a date object into a string with the format MM/DD/YY HH:mm.
 * @param {Date} date - The date object to format.
 * @returns {string} The formatted date and time string.
 */
function formatDateTime(date) {
    // Format the date and time to MM/DD/YY HH:mm
    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    let year = String(date.getFullYear()).slice(-2); // Get the last two digits of the year
    let hours = String(date.getHours()).padStart(2, "0");
    let minutes = String(date.getMinutes()).padStart(2, "0");
    return month + "/" + day + "/" + year + " " + hours + ":" + minutes;
}

/**
 * Creates a Bootstrap alert dynamically and appends it to a specified container
 * if an alert with the same message does not already exist.
 * @param {HTMLElement} container - The DOM element where the alert should be appended.
 * @param {string} message - The message to display in the alert.
 * @param {string} type - The type of alert (e.g., 'danger', 'success', 'warning', 'info').
 */
function createBootstrapAlert(container, message, type) {
    // Clear previous alerts of the same type to ensure a fresh alert can be displayed
    Array.from(container.children).forEach((child) => {
        if (child.classList.contains(`alert-${type}`)) {
            container.removeChild(child);
        }
    });

    let alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute("role", "alert");

    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    `;

    // Append the alert to the specified container
    container.appendChild(alertDiv);

    // Add a click event listener to the close button to remove the alert from DOM when closed
    alertDiv.querySelector(".close").addEventListener("click", function () {
        alertDiv.remove();
    });
}
