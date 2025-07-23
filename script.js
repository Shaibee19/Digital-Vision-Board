// INITIALIZATION
let visionBoardItems = [];
let isEditing = false;
let editingItemID = null;

// GET ELEMENTS FROM THE PAGE
const modal = document.getElementById("appModal");
const addButton = document.getElementById("addItemBtn");
const closeButton = document.getElementById("closeModalBtn");
const saveButton = document.getElementById("saveItemBtn");
const visionBoard = document.getElementById("visionBoard");

// WHEN THE PAGE LOADS, SET EVERYTHING UP
document.addEventListener("DOMContentLoaded", function () {
  updateDate();
  loadSavedItems();
  displayItems();
  setupEventListeners();
});

// SET UP CLICK EVENTS
function setupEventListeners() {
  addButton.addEventListener("click", openAddModal);
  closeButton.addEventListener("click", closeModal);
  saveButton.addEventListener("click", saveItem);

  // CLOSE MODAL WHEN CLICKING OUTSIDE OF IT
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });
}

// UPDATE THE DATE IN THE HEADER
function updateDate() {
  const now = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = days[now.getDay()];
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();
  const formattedDate = `${month}/${day}/${year}`;

  document.getElementById("currentDay").textContent = dayName;
  document.getElementById("currentDate").textContent = formattedDate;
}

// OPEN THE MODAL TO ADD A NEW ITEM
function openAddModal() {
  document.getElementById("modalTitle").textContent = "Add New Goal";
  document.getElementById("inputTitle").value = "";
  document.getElementById("inputDescription").value = "";
  document.getElementById("inputImageURL").value = "";

  // SET BLUE AS DEFAULT
  document.querySelector(
    'input[name="itemStyle"][value="blue"]'
  ).checked = true;

  isEditing = false;
  editingItemID = null;
  modal.style.display = "flex";
}

// CLOSE THE MODAL
function closeModal() {
  modal.style.display = "none";
}

// OPEN THE MODAL TO EDIT AN ITEM
function openEditModal(item) {
  // declares the function named openEditModal that accepts one parameter called item containing the goal data to be edited.
  document.getElementById("modalTitle").textContent = "Edit Goal"; // changes the modal title to "Edit Goal" since add goal and edit goal use the same modal, so we need to update the title to reflect the current
  document.getElementById("inputTitle").value = item.title; // sets the title input field to display the current title of the item being edited.
  document.getElementById("inputDescription").value = item.description; // sets the description input field to display the currect description of the item being edited.
  document.getElementById("inputImageURL").value = item.imageURL || ""; // sets the image URL input field to display the current image URL of the item being edited.

  // SET THE CORRECT STYLE
  document.querySelector(
    `input[name="itemStyle"][value="${item.style}"]`
  ).checked = true; // finds the radio button matching the item's current color style and selects it. || item.style can be "blue", "purple", or "white".

  isEditing = true; // sets the global flag to indicate we're in editing mode rather than adding a new item.
  editingItemID = item.id; // saves the current item's ID so we know which item to update when the user saves changes (show saveItem function id value in the item variable).
  modal.style.display = "flex"; // makes the modal visible be setting its display porperty to "flex".
}

// HELPER FUNCTION TO EDIT ITEM BY ID
function editItemByID(itemID) {
  // declares a function named editItemByID that accepts one parameter called itemID.
  const item = visionBoardItems.find((i) => i.id === itemID); // searches the visionBoardItems array to find an item whose id property matches
  if (item) {
    // if that item exists then call the openEditModal passing the item in question from the visionBoard array of items.
    openEditModal(item);
  }
}

// DISPLAY ALL ITEMS ON THE BOARD
function displayItems() {
  // function declaration
  if (visionBoardItems.length === 0) {
    // Checks if the visionBoardItems array (array that holds all he goals objects) is empty, so if it is, it displays an empty state message.
    visionBoard.innerHTML = `
          <div class="empty__state">
            <p>Your vision board is empty. Click the + button to add your first goal!</p>
          </div>
        `;
    return;
  }

  visionBoard.innerHTML = ""; // line clears existing content to prevent duplicates when displayItems() is called multiple times.

  visionBoardItems.forEach((item) => {
    // loops through each item in the array and creates a new div element with CSS classes for styling.
    const boardItem = document.createElement("div");
    boardItem.className = `board__item ${item.style}`; // show example of blue/white/purple classes in CSS

    // then grab that recent created div with the styling based on whatever style the user selected in the modal and set its innerHTML:
    boardItem.innerHTML = `
        <div class="item__image">
          ${
            item.imageURL // checks if the user placed any picture, if he did show the picture, if not show the placeholder
              ? `<img src="${item.imageURL}" alt="${item.title}"`
              : `<div class="item__image--placeholder">No image</div>`
          }
        </div>
        <div class="item__content">
        <!-- item title selected by the user -->
          <div class="item__title">${item.title}</div>
          <div class="item__description">${
            item.description || "No description"
          }</div>
          <div class="action__buttons">
          <!-- creates two action buttone for each item - an edit button that calls editItemByID and a delete button that calls deleteItem -->
            <button class="action__btn btn__secondary" onclick="editItemByID('${
              item.id
            }')">
              <svg>
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                veiwBox"0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="action__btn btn__primary" onclick="deleteItem('${
              item.id
            }')"> <svg>
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                veiwBox"0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </div>
      `;

    visionBoard.appendChild(boardItem); // adds the completed item element to the vision board container, making it visible on the page
    // appendChild adds an element to the end of a parent element. In this case, it puts the new item into the vision board so it shows on your
  });
}

// SAVE ITEMS TO BROWSER STORAGE
function saveItemsToStorage() {
  // since localStorage isn't available we simulate its behaviour, so this function consoles the visionBoardItems (array of all items), and
  try {
    console.log("Saving items:", visionBoardItems);
  } catch (error) {
    console.log("Could not save items to storage");
  }
}

// SAVE A NEW OR EDITED ITEM
function saveItem() {
  // function handles saving both new and edited items by first getting the form input values and validating that a title was entered
  const title = document.getElementById("inputTitle").value.trim();

  if (!title) {
    alert("Please enter a goal title");
    return;
  }

  const description = document.getElementById("inputDescription").value.trim();
  const imageURL = document.getElementById("inputImageURL").value.trim();

  // finds all the color theme radio buttons, loops through them to find which one is selected, and stores that value (defaulting to "")
  let selectedStyle = "blue";
  const styleRadios = document.querySelectorAll('input[name="itemStyle"]');
  for (let radio of styleRadios) {
    if (radio.checked) {
      selectedStyle = radio.value; //sets the selectedStyles variable to radio.value from the checked radio input
      break; //when the selected one is found, break the for loop
    }
  }

  // creates a complete item object with all the form data, using either the existing item's ID (if editing) or generating a new times
  const item = {
    id: isEditing ? editingItemID : Date.now().toString(),
    title: title,
    description: description,
    imageURL: imageURL,
    style: selectedStyle,
  };

  if (isEditing) {
    // determines whether we're editing an existing item or adding a new one, if editing, it finds and replaces the existing item in the
    const itemIndex = visionBoardItems.findIndex((i) => i.id === editingItemID);
    if (itemIndex !== 1) {
      // if it is found then replace the current item to the new one (item)
      visionBoardItems[itemIndex] = item;
    }
  } else {
    // if it is not found then it means it is a new one and in that case we want to push the created item to the visionBoardItems ( the array that)
    visionBoardItems.push(item);
  }

  // completes the save process by storing the data (simulation), refreshing the display to show the changes, and closing the modal dialog
  saveItemsToStorage();
  displayItems();
  closeModal();
}

// DELETE AN ITEM
function deleteItem(itemID) {
  // function handles deleting an item by its ID and first shows a confirmation dialog to prevent accidental deletions.
  if (confirm("Are you sure you want to delete this goal?")) {
    // created a new array containing all items except the one with the matching ID, effectively removing the target itme from the database
    visionBoardItems = visionBoardItems.filter((item) => item.id !== itemID);
    // saves the updated array (simulation) and refreshs the display to show the item has been removed, but only executed if the user
    saveItemsToStorage();
    displayItems();
  }
}

// LOAD SAVED ITEMS FROM BROWSER STORAGE (SIMULATION)
function loadSavedItems() {
  // function is designed to load previously saved vision board items and uses a try-catch block to handle potential errors when accessing
  try {
    // now, we just set the visionBoardItems array to empty because localStorage isn't available in this environment.
    visionBoardItems = [];
    /* NORMAL IMPLEMENTATION WOULD BE:
    const savedItems =  localStorage.getItem('visionBoardItems');
    visionBoardItems = savedItems ? JSON.parse(savedItems) : [];
    */
  } catch (error) {
    // if it failed for any reason, it logs an error message and defaults to an empty array, ensuring the app still works even if storage
    console.log("Could not load saved items");
    visionBoardItems = [];
  }
}
