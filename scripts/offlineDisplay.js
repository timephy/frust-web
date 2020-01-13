const button = document.getElementById("mainButton");
const anker = document.getElementById("toastAnker");
const wrapper = document.getElementById("wrapper");
const panker = document.getElementById("popupAnker");
const nameInput = document.getElementById("nameInput");
const commentInput = document.getElementById("commentInput");
const today = document.getElementById("today");
const online = document.getElementById("online");
const session = document.getElementById("session");
const total = document.getElementById("total");

/** The possible label alternatives for the main button. */
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

/** The message displayed by "help" command. */
const HELP_MESSAGE = [
  "Click colors:",
  "    " + ["green", "purple", "blue", "yellow", "black", "white"].join(", "),
  "Click lines:",
  "    " + ["small", "big", "dotted", "dashed"].join(", "),
  "Events:",
  "    " + ["fuck", "einstein", "satan", "666", "pride", "fireworks", "rainbow"].join(", "),
  "Manage:",
  "    " + ["vibrate", "darkmode", "clear"].join(", ")
].join("\n")

/** effect variables */
var resetableTimers = {};
var toastType = "toast";

var tfrag = document.createDocumentFragment();

/** A helper class to manage and update current stats. */
class StatsDisplay {
  // total
  get total() {
    return this._total || 0;
  }
  set total(value) {
    this._total = value;
    total.textContent = this.total;

    if (value % 10000 == 0) {
      popup("+10.000")
    } else if (value % 1000 == 0) {
      popup("+1.000")
    }
  }

  // day
  get day() {
    return this._today || 0;
  }
  set day(value) {
    this._today = value;
    today.textContent = this.day;
  }

  // session
  get session() {
    return this._session || 0;
  }
  set session(value) {
    this._session = value;
    session.textContent = this.session;
  }

  // online
  get online() {
    return this._online || 0;
  }
  set online(value) {
    this._online = value;
    online.textContent = this.online;
  }
}

const statsDisplay = new StatsDisplay()

// Utils

/** Display a popup. */
function popup(text, cssClass) {
  const pop = document.createElement("div")
  if (!cssClass)
    pop.className = "popup";
  else
    pop.className = cssClass;

  pop.appendChild(document.createTextNode(text));
  panker.appendChild(pop);
  destroyDelay(pop, 5000);
}

/** Fireworks effect. */
function fireworks() {
  const pyro = document.createElement("div")
  pyro.className = "pyro";
  pyro.innerHTML = '<div class="before"></div> <div class="after"></div>';
  panker.appendChild(pyro);
  destroyDelay(pyro, 5000);
}

/** Einstein effect. */
function einstein() {
  var einstein = document.createElement("img")
  einstein.className = "einstein"
  einstein.style.left = Math.random() * 90 + "%"
  einstein.style.top = Math.random() * 90 + "%"

  panker.appendChild(einstein);
  destroyDelay(einstein, 5000);
}

/** Returns a randomized button label. */
function displayRandomButtonLabel() {
  button.textContent = Math.random() < 0.9 ?
    "ich verzweifle" :
    possibleButtonLabels[Math.floor(Math.random() * possibleButtonLabels.length)];
}

/** Toggle comment field. */
function openComment(commentButton) {
  if (commentInput.classList.contains("hide")) {
    commentButton.classList.remove("hide")
    commentInput.classList.remove("hide")
    commentInput.parentElement.classList.remove("hide")
    //nameInput.blur()
    //commentInput.focus()
  } else {
    commentButton.classList.add("hide")
    commentInput.classList.add("hide")
    commentInput.parentElement.classList.add("hide")
    //commentInput.blur()
    //nameInput.focus()
  }
}

/** Displays the buttom click animation. */
var ringBase;
ringBase = document.createElement("div");
ringBase.className = "ring";

function displayRing() {
  const ring = ringBase.cloneNode(true);
  button.parentElement.appendChild(ring);
  destroyDelay(ring, 700);
  displayToast("Du bist OFFLINE und verzweifelst alleine","");
}

/** Displays a click (Killfeed-like-style). */
function displayClick(name, comment, effectClass) {
  let text = `${name} verzweifelt...`
  // add comment in braces if present
  if (comment != undefined && comment != "") {
    text = text.concat(` (${comment})`);
  }
  displayToast(text, effectClass);
}

function displayToast(string, effectClass) {
  // prevent extreme amounts of comment messages
  if (anker.childElementCount > MAX_TOASTS)
    anker.lastElementChild.remove();

  const toast = document.createElement("div")
  toast.className = [toastType, effectClass].join(" ");
  toast.textContent  = string;
  tfrag.prepend(toast);
  hideDelay(toast, 2500);
  destroyDelay(toast, 3000);
}

function step(timestamp) {
  window.requestAnimationFrame(step);
  anker.prepend(tfrag);
  tfrag = document.createDocumentFragment();
}
window.requestAnimationFrame(step);
