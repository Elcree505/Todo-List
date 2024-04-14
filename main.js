const form = document.getElementById("addForm");

// Create two seperates item lists
const unfinishedList = document.getElementById("unfinishedItems");
const finishedList = document.getElementById("finishedItems");

const filter = document.getElementById("filter");
const textInput = document.getElementById("item");

// Form submit event
form.addEventListener("submit", addItem);

// Finish Item event
unfinishedList.addEventListener("click", finishItem)

// Unfinish Item event
finishedList.addEventListener("click", undoItem);

// Delete event
unfinishedList.addEventListener("click", removeItem);
finishedList.addEventListener("click", removeItem);

// Edit Item event
unfinishedList.addEventListener("click", editItem);
finishedList.addEventListener("click", editItem);

// Filter event
filter.addEventListener("keyup", filterItem);

// Check if the item is empty or already exists
function checkItem(newItem) {
    // Check if the item is empty
    if (newItem.trim() === "") {
        alert("Item cannot be empty");
        return false;
    }

    // Check if the item already exists
    let checkUnfinished = Array.from(unfinishedList.getElementsByTagName("li"));
    let checkFinished = Array.from(finishedList.getElementsByTagName("li"));
    let checkAllItems = checkUnfinished.concat(checkFinished);

    for (let i = 0; i < checkAllItems.length; i++) {
        if (checkAllItems[i].textContent.replace("doneXEdit", "").trim().toLowerCase() === newItem.toLowerCase()) {
            alert("Item already exists");
            return false;
        }
    }

    return true;
}

// Counter for the number of items
function countItems() {
    const unfinishedItems = unfinishedList.getElementsByTagName("li").length;
    const finishedItems = finishedList.getElementsByTagName("li").length;

    // Get the elements where the counts will be displayed
    let unfinishedCount = document.getElementById("unfinishedCount");
    let finishedCount = document.getElementById("finishedCount");

    // Update the counts
    unfinishedCount.textContent = unfinishedItems;
    finishedCount.textContent = finishedItems;
}

// Add item
function addItem(e) {
    e.preventDefault();

    // Get input values
    let newItem = document.getElementById("item").value;

    // Check if the item is empty
    if (!checkItem(newItem)) {
        textInput.value = "";
        return;
    }


    // Create li element
    let li = document.createElement("li");
    // Add class
    li.className = "list-group-item";
    // Add text node with input value
    li.appendChild(document.createTextNode(newItem));

    // Create finish buttons
    let finishBtn = document.createElement("button");

    // Create delete buttons
    let deleteBtn = document.createElement("button");

    // Create edit buttons
    let editBtn = document.createElement("button");

    // Add classes to finish button
    finishBtn.className = "btn btn-sm float-right finish";

    // Add classes to delete button
    deleteBtn.className = "btn btn-danger btn-sm float-right delete";

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

    // Update count
    countItems();

    // Clear input value
    textInput.value = "";
}

// Edit Item
function editItem(e) {
    if (e.target.classList.contains("edit")) {
        let li = e.target.parentElement;
        let text = li.firstChild.textContent;

        // Prompt user to enter new text
        let newText = prompt("Edit item", text);

        // Check if the item is empty
        if (!checkItem(newItem)) {
            textInput.value = "";
            return;
        }

        // Update the text
        li.firstChild.textContent = newText;
    }
}

// Finish item
function finishItem(e) {
    if (e.target.classList.contains("finish")) {
        let li = e.target.parentElement;
        
        // Prevent from user clicking finish button repeatedly
        if (!li.classList.contains("finished")) {
            li.style.textDecoration = "line-through";
            li.classList.add("finished")

            // Remove the finish button from the item
            let finishBtn = e.target;
            li.removeChild(finishBtn);

            // Add an undo button to the finished item
            let undoBtn = document.createElement("button");
            undoBtn.className = "btn btn-sm float-right undo";
            undoBtn.appendChild(document.createTextNode("undo"));

            // Insert the undo button at the beginning of the list item
            li.insertBefore(undoBtn, li.firstChild);

            // Remove the item from the unfinished list and add it to the finished list
            unfinishedList.removeChild(li);
            finishedList.appendChild(li);
        }

        // Update count
        countItems();
    }
}

// Undo item
function undoItem(e) {
    if (e.target.classList.contains("undo")) {
        let li = e.target.parentElement;
        li.style.textDecoration = "none";
        li.classList.remove("finished");

        // Remove the undo button from the item
        let undoBtn = e.target;
        li.removeChild(undoBtn);

        // Add a finish button to the item
        let finishBtn = document.createElement("button");
        finishBtn.className = "btn btn-sm float-right finish";
        finishBtn.appendChild(document.createTextNode("done"));
        
         // Insert the undo button at the beginning of the list item
         li.insertBefore(finishBtn, li.firstChild);

        // Remove the item from the finished list and add it to the unfinished list
        finishedList.removeChild(li);
        unfinishedList.appendChild(li);

        // Update count
        countItems();


    }
}

// Remove item
function removeItem(e) {
    if (e.target.classList.contains("delete")) {


        if (confirm("Are you sure to delete this item?")) {
            let li = e.target.parentElement;
            // Check which list the items is in
            if (li.parentElement === unfinishedList) {
                unfinishedList.removeChild(li);
            } else if (li.parentElement === finishedList) {
                finishedList.removeChild(li);
            }

            // Update the counts
            countItems();

        }

    }

}

// Filter item
function filterItem(e) {
    // covert text to lowercase
    let text = e.target.value.toLowerCase();

    // Get list items
    let unfinishedItem = Array.from(unfinishedList.getElementsByTagName("li"));
    let finishedItem = Array.from(finishedList.getElementsByTagName("li"));
    let items = unfinishedItem.concat(finishedItem);

    // Convert to an array
    Array.from(items).forEach(function (item) {
        let itemName = item.firstChild.textContent;
        if (itemName.toLowerCase().indexOf(text) != -1) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}