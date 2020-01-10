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

/** effect variables */
var resetableTimers = {};
var toastType = "toast";

var tfrag = document.createDocumentFragment();

function displayStats(total, day) {
  total.innerText = currentStats["total"];
  today.innerText = currentStats["day"];
  session.innerText = sessionClicks;

  if (total % 10000 == 0) {
    popup("+10.000")
  } else if (total % 1000 == 0) {
    popup("+1.000")
  }
}

function displayOnlineUsers(num) {
  online.innerText = num;
}

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
function randomButtonLabel() {
  return Math.random() < 0.9 ?
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
