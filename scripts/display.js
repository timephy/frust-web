const button = document.getElementById("mainButton");
const anker = document.getElementById("toastAnker");
const wrapper = document.getElementById("wrapper");
const panker = document.getElementById("popupAnker");
const nameInput = document.getElementById("nameInput");
const commentInput = document.getElementById("commentInput");
const rightDisp = document.getElementById("rightDisp");
const leftDisp = document.getElementById("leftDisp");
const usersDisp = document.getElementById("stats");

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

class StatsDisplay {
  constructor(leftDisp, rightDisp) {
    this.leftDisp = leftDisp;
    this.rightDisp = rightDisp;
  }

  updateLeftDisplay() {
    this.leftDisp.innerHTML = `gesamt<br>${this.total}<br>online<br>${this.online}`;
  }

  updateRightDisplay() {
    this.rightDisp.innerHTML = `heute<br>${this.day}<br>sitzung<br>${this.session}`;
  }

  // total
  get total() {
    return this._total || 0;
  }
  set total(value) {
    this._total = value;
    this.updateLeftDisplay();

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
    this.updateRightDisplay();
  }

  // session
  get session() {
    return this._session || 0;
  }
  set session(value) {
    this._session = value;
    this.updateRightDisplay();
  }

  // online
  get online() {
    return this._online || 0;
  }
  set online(value) {
    this._online = value;
    this.updateLeftDisplay();
  }
}

const statsDisplay = new StatsDisplay(leftDisp, rightDisp)

// Utils

function incrementStats() {
  currentStats["total"]++;
  currentStats["day"]++;
}

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

function fireworks() {
  const pyro = document.createElement("div")
  pyro.className = "pyro";
  pyro.innerHTML = '<div class="before"></div> <div class="after"></div>';
  panker.appendChild(pyro);
  destroyDelay(pyro, 5000);
}

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
  button.innerText = Math.random() < 0.9 ?
    "ich verzweifle" :
    possibleButtonLabels[Math.floor(Math.random() * possibleButtonLabels.length)];
}

// Clicks
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
function displayRing() {
  const ring = document.createElement("div");
  ring.className = "ring";
  button.parentElement.appendChild(ring);
  window.getComputedStyle(ring).opacity;
  ring.classList.add("show");
  destroyDelay(ring, 700);
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
  toast.innerText = string;
  tfrag.prepend(toast);
  hideDelay(toast, 2500);
  destroyDelay(toast, 3000);
}

function step(timestamp) {
  window.requestAnimationFrame(step);
  if (tfrag.childElementCount > 0)
    console.log(tfrag.childElementCount)
  anker.prepend(tfrag);
  tfrag = document.createDocumentFragment();
}
window.requestAnimationFrame(step);
