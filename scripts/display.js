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

/** effect variables */
var resetableTimers = {};
var toastType = "toast";
var currentUsers = 0;

function displayStats(total, day) {
  leftDisp.innerText = "gesamt\n" + currentStats["total"] + "\nonline\n" + currentUsers;
  rightDisp.innerText = "heute\n" + currentStats["day"] + "\nsitzung\n" + sessionClicks;


  if (total % 10000 == 0) {
    popup("+10.000")
  } else if (total % 1000 == 0) {
    popup("+1.000")
  }
}

function displayOnlineUsers(num) {
  currentUsers = num;
    leftDisp.innerText = "gesamt\n" + currentStats["total"] + "\nonline\n" + currentUsers;
    rightDisp.innerText = "heute\n" + currentStats["day"] + "\nsitzung\n" + sessionClicks;
  //usersDisp.innerText = "online\n" + num;
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
  pyro.className = "pyro"
  let t = document.createElement("div")
  t.className = "before";
  pyro.appendChild(t)
  t = document.createElement("div")
  t.className = "after"
  pyro.appendChild(t)

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
  toast.appendChild(document.createTextNode(string));
  anker.prepend(toast);
  hideDelay(toast, 2500);
  destroyDelay(toast, 3000);
}
