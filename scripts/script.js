var button = document.getElementById("mainButton");
var anker = document.getElementById("toastAnker");
var wrapper = document.getElementById("wrapper");
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
  "Zeile mal Spalte",
  "?????"
];

var name;
var comment;
var vibrationsActive = false;

/** Loads stored data from storage. */
document.body.onload = () => {
  // load name, comment
  name = storage.getItem(NAME_KEY);
  comment = storage.getItem(COMMENT_KEY);

  // set name, comment
  nameInput.value = name;
  commentInput.value = comment;
};


var socket = io({
  path: "/api/socket.io"
});

// Stats
var currentStats = {
  "total": 0,
  "day": 0,
  "hour": 0
};
var sessionClicks;

/** effect variables */
var resetableTimers = {};
var toastType = "toast";

function displayStats(total, day, hour) {
  totalDisp.innerText = "gesamt\n" + total;
  todayDisp.innerText = "heute\n" + day;

  if (total % 10000 == 0) {
    popup("+10.000")
  } else if (total % 1000 == 0) {
    popup("+1.000")
  }
}

function displayOnlineUsers(num) {
  usersDisp.innerText = "online\n" + num;
}

// Utils

function incrementStats() {
  currentStats["total"]++;
  currentStats["day"]++;
  currentStats["hour"]++;

  sessionClicks++;
}

function popup(text, cssClass) {
  var pop = document.createElement("div")
  if (!cssClass)
    pop.className = "popup";
  else
    pop.className = cssClass;

  pop.appendChild(document.createTextNode(text));
  panker.appendChild(pop);
  destroyDelay(pop, 5000);
}

function fireworks() {
  var pyro = document.createElement("div")
  pyro.className = "pyro"
  var t = document.createElement("div")
  t.className = "before";
  pyro.appendChild(t)
  var t = document.createElement("div")
  t.className = "after"
  pyro.appendChild(t)

  panker.appendChild(pyro);
  destroyDelay(pyro, 5000);
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

  if (navigator.vibrate && vibrationsActive) { // vibration API supported
    navigator.vibrate(100);
  }

  // Inputs
  let sanitizedName = sanitizeInput(nameInput.value);
  if (sanitizedName != name)
    storage.setItem(NAME_KEY, sanitizedName);
  name = sanitizedName || "Anonym"; // or default name

  let sanitizedComment = sanitizeInput(commentInput.value);
  // commands are not saved
  if (sanitizedComment != comment && !sanitizedComment.startsWith("/"))
    storage.setItem(COMMENT_KEY, sanitizedComment);
  comment = sanitizedComment || "";

  if (comment.startsWith("/")) { // Command
    command = comment.substring(1);

    switch (command) {
      case "vibrate":
        vibrationsActive = !vibrationsActive;
        console.log("vibrationsActive   " + vibrationsActive)
        break;
      case "rainbow":
        addTemporaryClass(wrapper, "rainbowColor", 8000);
        break;
      case "small":
      case "big":
      case "green":
      case "purple":
      case "blue":
      case "yellow":
        socket.emit("event", {
          "id": command
        });
        break;
      case "fuck":
      case "fireworks":
      case "satan":
      case "gaypride":
        socket.emit("event", {
          "id": command
        });
        break;
      default:
        // No command matched
        alert("Kommando nicht valide.");
        break;
    }

  } else { // Click
    socket.emit("click", {
      "name": name,
      "comment": comment
    });
  }

  // Purely Visual
  // Display creative and original message
  button.innerText = randomButtonLabel()+'\n'+sessionClicks;
  displayRing();
}

/** String corrections for input fields. */
const sanitizeInput = (input) => input.trim();

/** Displays the buttom click animation. */
function displayRing() {
  var ring = document.createElement("div");
  ring.className = "ring";
  button.parentElement.appendChild(ring);
  window.getComputedStyle(ring).opacity;
  ring.classList.add("show");
  destroyDelay(ring, 700);
}

/** Displays a click (Killfeed-like-style). */
function displayClick(name, comment, effectClass) {
  // prevent extreme amounts of comment messages
  if (anker.childElementCount > MAX_TOASTS)
    anker.lastElementChild.remove();

  var text = `${name} verzweifelt...`
  // add comment in braces if present
  if (comment != undefined && comment != "") {
    text = text.concat(` (${comment})`);
  }

  var toast = document.createElement("div")
  toast.className = toastType + " " + effectClass;
  toast.appendChild(document.createTextNode(text));
  anker.prepend(toast);
  hideDelay(toast, 2500);
  destroyDelay(toast, 3000);
}

/** Adds hide class to element after specified time. */
function hideDelay(element, time) {
  setTimeout(() => element.classList.add("hide"), time);
}

/** Removes the element from its parent after specified time. */
function destroyDelay(element, time) {
  setTimeout(() => element.remove(), time);
}

/**adds the class to element and then removes it after a delay  */
function addTemporaryClass(targetElem, cssClass, time) {
  if (!!resetableTimers[cssClass]) {
    clearTimeout(resetableTimers[cssClass])
  }
  targetElem.classList.add(cssClass);
  resetableTimers[cssClass] = setTimeout(() => targetElem.classList.remove(cssClass), time);
  console.log(cssClass + ": timer " + resetableTimers[cssClass])
}

// Data store
var storage = window.localStorage;


// Socket.io
socket.on("stats", (stats) => {
  console.log(`stats(${stats["total"]}, ${stats["day"]}, ${stats["hour"]})`);
  currentStats = stats;
  displayStats(stats["total"], stats["day"], stats["hour"]);
});

socket.on("users", (users) => {
  console.log(`users(${users["count"]})`);
  displayOnlineUsers(users["count"]);
});

socket.on("click", (click) => {
  console.log(`click(${click["name"]}, ${click["comment"]})`);

  displayClick(click["name"], click["comment"])
  incrementStats()
  displayStats(currentStats["total"], currentStats["day"], currentStats["hour"]);
});

socket.on("event", (event) => {
  console.log(`event(${event["id"]})`);

  // Reacting to "everyone events"
  switch (event["id"]) {
    case "yellow":
      displayClick("Lemon", "", "yellow dashed")
      break;
    case "blue":
      displayClick("Im blue", "", "blue")
      break;
    case "purple":
      displayClick("Jemand", "", "purple")
      break;
    case "green":
      displayClick("TeamTrees", "", "green dotted")
      break;
    case "gaypride":
      addTemporaryClass(button, "rainbow", 8000);
      break;
    case "satan":
      addTemporaryClass(button, "elmo", 3000);
      break;
    case "big":
      displayClick("bigBoy", "", "big")
      break;
    case "small":
      displayClick("Kann man das lesen???", "", "small");
      break;
    case "fuck":
      popup("Fuck you", "fu");
      break;
    case "fireworks":
      fireworks()
      break;
  }
});

socket.connect();
