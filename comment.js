/**
 * - Use ES6 let / const more than var
 * - Write JSDoc for every function to define types
 * - Understanding the concept of closure, make sure not to mutate global variables accidentally
 * - If some code paragraph seems like it can be reuse, then wrap it with a function and reuse it
 */

/**
 * An html element
 */
const itemList = document.getElementById("items");
const textInput = document.getElementById("item");

/**
 * Create an li element, set content value, and return
 * @param {string} content content of new item
 */
function createNewItemElement(content) {
    // Create li element
    const li = document.createElement("li");

    // Add class
    li.className = "list-group-item";

    // Add text node with input value
    li.appendChild(document.createTextNode(content));

    // Create delete buttons
    const deleteBtn = document.createElement("button");

    // Add classes to delete button
    deleteBtn.className = "btn btn-danger btn-sm float-right delete";

    // Append text node
    deleteBtn.appendChild(document.createTextNode("X"));

    // Append button to li
    li.appendChild(deleteBtn);

    return li;
}

/**
 * For example, this is a function to add an item to itemList
 * @param {HTMLElement} e
 */
function addItem(e) {
    // Think twice: What will happen when there is no this html element?
    if (!e) {
        return;
    }

    // Think twice: Why do we need prevent default?
    e.preventDefault();

    /**
     * Step 1: Get element value
     */
    // Get element
    const getNewItemElement = document.getElementById("item");

    // Think twice: What will happen when there is no this html element?
    if (!getNewItemElement) {
        return;
    }

    /**
     * Get value
     * @type {string}
     */
    const newItemValue = getNewItemElement.value;

    /**
     * Step 2: Create an element, set value
     */
    const newItemElement = createNewItemElement(newItemValue);

    /**
     * Step 3: Append it to DOM
     */
    // Append li to list
    itemList.appendChild(newItemElement);

    // Clear input value
    textInput.value = "";
}
