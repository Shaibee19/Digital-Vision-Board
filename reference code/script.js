// 1. Declare the vision board items array
let visionBoardItems = [];
let isEditing = false;
let editingItemId = null;

// 2. Get elements from the page
const modal = document.getElementById("appModal");
const addButton = document.getElementById("addItemBtn");
const closeButton = document.getElementById("closeModalBtn");
const saveButton = document.getElementById("saveItemBtn");
const visionBoard = document.getElementById("visionBoard");

// 3. When the page loads, set up everything
document.addEventListener("DOMContentLoaded", function () {
  updateDate();
  // loadSavedItems();  Added only when loadSavedItems() is added
  // displayItems(); //  Added only when displayItems() is added
  setupEventListeners();
});

// 4. Set up click events
function setupEventListeners() {
  addButton.addEventListener("click", openAddModal);
  closeButton.addEventListener("click", closeModal);
  // saveButton.addEventListener("click", saveItem); // Added only when saveItem() is added

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });
}

// 5. Update the date in the header
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

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  document.getElementById("currentDay").textContent = dayName;
  document.getElementById("currentDate").textContent = formattedDate;
}

// 6. Open the modal to add a new item
function openAddModal() {
  document.getElementById("modalTitle").textContent = "Add New Goal";
  document.getElementById("inputTitle").value = "";
  document.getElementById("inputDescription").value = "";
  document.getElementById("inputImageUrl").value = "";

  // Set blue as default
  document.querySelector(
    'input[name="itemStyle"][value="blue"]'
  ).checked = true;

  isEditing = false;
  editingItemId = null;
  modal.style.display = "flex"; 
}

// 7. Close the modal
function closeModal() {
  modal.style.display = "none";
}

// Add new code here...




