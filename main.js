var form = document.getElementById("addForm");

// Create two seperates item lists
var unfinishedList = document.getElementById("unfinishedItems");
var finishedList = document.getElementById("finishedItems");

var filter = document.getElementById("filter");
var textInput = document.getElementById("item");

// Form submit event
form.addEventListener("submit", addItem);

// Finish Item event
unfinishedList.addEventListener("click", finishItem)

// Delete event
unfinishedList.addEventListener("click", removeItem);
finishedList.addEventListener("click", removeItem);

// Edit Item event
unfinishedList.addEventListener("click", editItem);
finishedList.addEventListener("click", editItem);

// Filter event
filter.addEventListener("keyup", filterItem);

// Counter for the number of items
function countItems() {
    var unfinishedItems = unfinishedList.getElementsByTagName("li").length;
    var finishedItems = finishedList.getElementsByTagName("li").length;

    // Get the elements where the counts will be displayed
    var unfinishedCount = document.getElementById("unfinishedCount");
    var finishedCount = document.getElementById("finishedCount");

    // Update the counts
    unfinishedCount.textContent = unfinishedItems;
    finishedCount.textContent = finishedItems;
}

// Add item
function addItem(e) {
    e.preventDefault();

    // Get input values
    var newItem = document.getElementById("item").value;

    // Check if the item is empty
    if (newItem.trim() === "") {
        alert("Item cannot be empty");
        return;
    }

    // Check if the item already exists
    var checkUnfinished = Array.from(unfinishedList.getElementsByTagName("li"));
    var checkFinished = Array.from(finishedList.getElementsByTagName("li"));
    var checkAllItems = checkUnfinished.concat(checkFinished);

    for (var i = 0; i < checkAllItems.length; i++) {
        if (checkAllItems[i].textContent.replace("doneX", "").trim().toLowerCase() === newItem.toLowerCase()) {
            alert("Item already exists");
            textInput.value = "";
            return;
        }

    }


    // Create li element
    var li = document.createElement("li");
    // Add class
    li.className = "list-group-item";
    // Add text node with input value
    li.appendChild(document.createTextNode(newItem));

    // Create finish buttons
    var finishBtn = document.createElement("button");

    // Create delete buttons
    var deleteBtn = document.createElement("button");

    // Create edit buttons
    var editBtn = document.createElement("button");

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
        var li = e.target.parentElement;
        var text = li.firstChild.textContent;

        // Prompt user to enter new text
        var newText = prompt("Edit item", text);

        // Check if the item is empty
        if (newText.trim() === "") {
            alert("Item cannot be empty");
            return;
        }

        // Check if the item already exists
        var checkUnfinished = Array.from(unfinishedList.getElementsByTagName("li"));
        var checkFinished = Array.from(finishedList.getElementsByTagName("li"));
        var checkAllItems = checkUnfinished.concat(checkFinished);

        for (var i = 0; i < checkAllItems.length; i++) {
            if (checkAllItems[i].textContent.replace("doneX", "").trim().toLowerCase() === newText.toLowerCase()) {
                alert("Item already exists");
                return;
            }

        }

        // Update the text
        li.firstChild.textContent = newText;
    }
}

// Finish item
function finishItem(e) {
    if (e.target.classList.contains("finish")) {
        var li = e.target.parentElement;
        
        // Prevent from user clicking finish button repeatedly
        if (!li.classList.contains("finished")) {
            li.style.textDecoration = "line-through";

            li.classList.add("finished")

            // Remove the item from the unfinished list and add it to the finished list
            unfinishedList.removeChild(li);
            finishedList.appendChild(li);
        }

        // Update count
        countItems();
    }
}

// Remove item
function removeItem(e) {
    if (e.target.classList.contains("delete")) {


        if (confirm("Are you sure to delete this item?")) {
            var li = e.target.parentElement;
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
    var text = e.target.value.toLowerCase();

    // Get list items
    var unfinishedItem = Array.from(unfinishedList.getElementsByTagName("li"));
    var finishedItem = Array.from(finishedList.getElementsByTagName("li"));
    var items = unfinishedItem.concat(finishedItem);

    // Convert to an array
    Array.from(items).forEach(function (item) {
        var itemName = item.firstChild.textContent;
        if (itemName.toLowerCase().indexOf(text) != -1) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}
