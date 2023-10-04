
//this is importing a function from another .js file to initialize the application
//pretty sure the source location is open source by Google
//but it might also be from Scrimba

//realtimedb url = https://realtime-database-8d785-default-rtdb.firebaseio.com/
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from 
"https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"


const appSettings = {
    databaseURL: //ommitted
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

//everything above this is creating the application and linking it to firebase
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const clearListButtonEl = document.getElementById("clear-list")

//option 1: click the button to add
addButtonEl.addEventListener("click", function() {
    pushToFirebase(inputFieldEl.value)
})

//option 2: press enter to add
inputFieldEl.addEventListener("keypress", function(event) {
    if(event.key === "Enter"){
        pushToFirebase(inputFieldEl.value)
    }
});

clearListButtonEl.addEventListener("dblclick", function(){
    let locString = `shoppingList`
    let firebaseLocList = ref(database, locString)
    remove(firebaseLocList)
})


onValue(shoppingListInDB, function(snapshot) {
    if(snapshot.exists()) {
    let shoppingList = Object.entries(snapshot.val())
    clearOnScreenList()
    for(let i = 0; i < shoppingList.length; i++) {
        let currentStruct = shoppingList[i]
        addToList(currentStruct)
    }} else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

//push Item to firebase
function pushToFirebase(inputFieldValue) {
    let inputStruct = [inputFieldValue, today()]
    //push to Firebase
    push(shoppingListInDB, inputStruct)
    //clear
    clearInput() 
}

//called when rendering the list
function addToList(newStruct) {
    //shoppingListEl.innerHTML += `<li> ${leString} </li>`
    let currentItemId = newStruct[0]
    let currentItemName = newStruct[1][0]
    let currentDay = newStruct[1][1]

    currentItemName = toTitleCase(currentItemName)

    let listItemEl = document.createElement("li")
    listItemEl.innerHTML = `<li class="item"> ${currentItemName} </li> <li class="day"> since ${currentDay} </li>`
    shoppingListEl.append(listItemEl)

    listItemEl.addEventListener("dblclick", function() {
        let locString = `shoppingList/${currentItemId}`
        let firebaseLocGrocery = ref(database, locString)
        remove(firebaseLocGrocery)
    })
}

function clearInput() {
    inputFieldEl.value = ""
}

function clearOnScreenList() {
    shoppingListEl.innerHTML = ""
}

function today() {
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const d = new Date();
    let day = weekday[d.getDay()];
    return day;
}
function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
}
