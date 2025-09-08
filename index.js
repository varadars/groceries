import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// --- Firebase Setup ---
const appSettings = {
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};
const app = initializeApp(appSettings);
const database = getDatabase(app);

const shoppingListInDB = ref(database, "shoppingList");
const travelListInDB = ref(database, "travelList");
let currentList = shoppingListInDB;

// --- DOM Elements ---
const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl =
  document.getElementById("shopping-list");
const travelListEl = document.getElementById("travel-list");
const groceriesTabEl =
  document.getElementById("groceries-tab");
const travelTabEl = document.getElementById("travel-tab");

// --- List Listeners ---
setupListListener(
  shoppingListInDB,
  shoppingListEl,
  groceriesTabEl,
  "shoppingList"
);
setupListListener(
  travelListInDB,
  travelListEl,
  travelTabEl,
  "travelList"
);

// --- Tab Switching ---

travelTabEl.addEventListener("click", () =>
  switchTab(
    travelListInDB,
    travelTabEl,
    groceriesTabEl,
    travelListEl,
    shoppingListEl
  )
);

groceriesTabEl.addEventListener("click", () =>
  switchTab(
    shoppingListInDB,
    groceriesTabEl,
    travelTabEl,
    shoppingListEl,
    travelListEl
  )
);

// --- Add Item Events ---
addButtonEl.addEventListener("click", () =>
  pushToFirebase(inputFieldEl.value)
);
inputFieldEl.addEventListener("keypress", (e) => {
  if (e.key === "Enter") pushToFirebase(inputFieldEl.value);
});

// --- Helpers ---
function setupListListener(
  dbRef,
  listElement,
  listToggleEl,
  listName
) {
  onValue(dbRef, (snapshot) => {
    if (!snapshot.exists()) {
      listElement.innerHTML = "No items here... yet";
      return;
    }
    listElement.innerHTML = "";
    for (let [id, [name, date]] of Object.entries(
      snapshot.val()
    )) {
      addToList(listElement, listName, id, name, date);
    }
    if (!listToggleEl.classList.contains("active")) {
      listElement.classList.add("hide");
    }
  });
}

function pushToFirebase(value) {
  if (!value.trim()) return;
  push(currentList, [value, today()]);
  clearInput();
}

function addToList(listElement, listName, id, name, date) {
  let item = document.createElement("li");
  item.innerHTML = `
    <li class="item">${toTitleCase(name)}</li>
    <li class="day">since ${toRelativeDate(date)}</li>
  `;
  item.addEventListener("dblclick", () =>
    remove(ref(database, `${listName}/${id}`))
  );
  listElement.append(item);
}

function clearInput() {
  inputFieldEl.value = "";
}

function switchTab(
  newList,
  activeTab,
  inactiveTab,
  showEl,
  hideEl
) {
  activeTab.classList.add("active");
  inactiveTab.classList.remove("active");
  showEl.classList.remove("hide");
  hideEl.classList.add("hide");
  currentList = newList;
}

// --- Utilities ---
function today() {
  return new Date().toString();
}

function toRelativeDate(str) {
  const d = new Date(str);
  if (isNaN(d)) return "before";

  const now = new Date();
  const daysAgo = (now - d) / 86400000;
  if (daysAgo < 6) {
    return [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][d.getDay()];
  }
  return `${
    d.getMonth() + 1
  }/${d.getDate()}/${d.getFullYear()}`;
}

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    (txt) =>
      txt.charAt(0).toUpperCase() +
      txt.substr(1).toLowerCase()
  );
}
