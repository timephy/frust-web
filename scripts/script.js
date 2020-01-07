var btnElem = document.getElementById("mainButton");
var anker = document.getElementById("toastAnker");
var panker = document.getElementById("popupAnker");
var nameInput = document.getElementById("nameInput");
var commentInput = document.getElementById("commentInput");
var todayDisp = document.getElementById("todayDisp");
var totalDisp = document.getElementById("totalDisp");
var usersDisp = document.getElementById("stats");

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

const MAX_TOASTS = 35; //please increase if you find any device that needs it
const NAME_KEY = "name";
const COMMENT_KEY = "comment";
const possibleButtonLabels = [
  "Exmatrikulation",
  "GOP",
  "noch Fragen?",
  "fresh Hermann",
  "E1GeNv3kToR",
  "I wanna die",
  "end me now",
  ":(",
  "（┬＿┬）",
  "(◕︵◕)",
  "RIP Studium",
  "\"mathe wird leicht\"",
  "Zeile mal Spalte",
  "?????"
];

var name = "guest";
var comment = "";

var socket = io({
  path: "/api/socket.io"
});

// Stats
var currentStats = {
  "total": 0,
  "day": 0,
  "hour": 0
};

function displayStats(total, day, hour) {
  totalDisp.innerText = "total\n" + total;
  todayDisp.innerText = "today\n" + day;

  if (total % 10000 == 0) {
    popup("+10.000")
  } else if (total % 1000 == 0) {
    popup("+1.000")
  } else if (day == 666) {
    console.log('satan is calling');
    btnElem.classList.add("elmo");
    popup("666")
    setTimeout(() => btnElem.classList.remove("elmo"), 2);
  }
}

function displayActiveUsers(num) {
  usersDisp.innerText = "active\n" + num;
}

// Utils

function incrementStats() {
  currentStats["total"]++;
  currentStats["day"]++;
  currentStats["hour"]++;
}

function popup(text){
  var pop = document.createElement("div")
  pop.className = "popup";
  pop.appendChild(document.createTextNode(text));
  panker.appendChild(pop);
  destroyDelay(pop, 5000);
}

/** Returns a randomized button label. */
function randomButtonLabel() {
  return Math.random() < 0.9 ?
    "ich verzweifle" :
    possibleButtonLabels[Math.floor(Math.random() * possibleButtonLabels.length)];
}

// Clicks

/** The main button action. */
function verzweifle() {

  if (navigator.vibrate) {
	  // vibration API supported
    navigator.vibrate(200); // vibrate for 200ms
  }

  if (validatedName(nameInput.value) != name) {
    name = validatedName(nameInput.value);
    storage.setItem(NAME_KEY, name);
  }

  if (validatedComment(commentInput.value) != comment) {
    comment = validatedComment(commentInput.value);
    storage.setItem(COMMENT_KEY, comment);
  }

  // Purely Visual
  // Display creative and original message
  btnElem.value = randomButtonLabel();
  displayRing();

  socket.emit("click", {
    "name": name,
    "comment": comment
  });
  // displayStats(currentStats["total"], currentStats["day"], currentStats["hour"]);
}

function validatedName(input) {
  var validatedInput = "jemand";
  if (input.trim() != "") {
    validatedInput = input.trim();
  }
  return validatedInput;
}

function validatedComment(input) {
  var validatedInput = "";
  if (input.trim() != "") {
    validatedInput = input.trim();
  }
  return validatedInput;
}

/** Displays the buttom click animation. */
function displayRing() {
  var ring = document.createElement("div");
  ring.className = "ring";
  btnElem.parentElement.appendChild(ring);
  window.getComputedStyle(ring).opacity;
  ring.classList.add("show");
  destroyDelay(ring, 700);
}

/** Displays a click (Killfeed-like-style). */
function displayClick(name, comment) {
  // prevent extreme amounts of comment messages
  if (anker.childElementCount > MAX_TOASTS)
    anker.lastElementChild.remove();

  var text = `${name} ist gerade verzweifelt...`
  // add comment in braces if present
  if (comment != undefined && comment != "") {
    text = text.concat(` (${comment})`);
  }

  var toast = document.createElement("div")
  toast.className = "toast";
  toast.appendChild(document.createTextNode(text));
  anker.prepend(toast);
  hideDelay(toast, 3000);
  destroyDelay(toast, 4000);
}

/** Adds hide class to element after specified time. */
function hideDelay(element, time) {
  setTimeout(() => element.classList.add("hide"), time);
}

/** Removes the element from its parent after specified time. */
function destroyDelay(element, time) {
  setTimeout(() => element.remove(), time);
}

// Data store
var storage = window.localStorage;

/** Loads stored data from storage. */
function loadFiles() {
  // load name, comment
  if (storage.getItem(NAME_KEY))
    name = storage.getItem(NAME_KEY);
  if (storage.getItem(COMMENT_KEY))
    comment = storage.getItem(COMMENT_KEY);

  // set name, comment
  nameInput.value = name;
  commentInput.value = comment;
}

document.body.onload = loadFiles();


// Socket.io
socket.on("stats", (stats) => {
  console.log(`stats(${stats["total"]}, ${stats["day"]}, ${stats["hour"]})`);
  currentStats = stats;
  displayStats(stats["total"], stats["day"], stats["hour"]);
});

socket.on("users", (users) => {
  console.log(`users(${users["count"]})`);
  displayActiveUsers(users["count"]);
});

socket.on("click", (click) => {
  console.log(`click(${click["name"]}, ${click["comment"]})`);

  displayClick(click["name"], click["comment"])
  incrementStats()
  displayStats(currentStats["total"], currentStats["day"], currentStats["hour"]);
});

socket.connect();
