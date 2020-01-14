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
  "    " + ["fuck", "einstein", "satan", "666", "pride", "fireworks", "rainbow", "fu"].join(", "),
  "Options:",
  "    " + ["vibrate", "darkmode", "clear"].join(", "),
  "Dev options:",
  "    " + ["buffer", "fps", "test", "ctest", "gtest", "rtest"].join(", ")
].join("\n")

/** effect variables */
var resetableTimers = {};

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
  }

  // session
  get session() {
    return this._session || 0;
  }
  set session(value) {
    this._session = value;
  }

  // online
  get online() {
    return this._online || 0;
  }
  set online(value) {
    this._online = value;
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
    commentInput.classList.remove("hide")
    commentInput.parentElement.classList.remove("hide")
    anime({
      targets: '#commentExpandPath',
      d: [{
          value: "m 0,25 L 50,75 L 100,25"
        },
        {
          value: "m 0,75 L 50,25 L 100,75"
        }
      ],
      easing: 'easeInOutSine',
      duration: 200
    });
    //nameInput.blur()
    //commentInput.focus()
  } else {
    commentInput.classList.add("hide")
    commentInput.parentElement.classList.add("hide")
    anime({
      targets: '#commentExpandPath',
      d: [{
          value: "m 0,75 L 50,25 L 100,75"
        },
        {
          value: "m 0,25 L 50,75 L 100,25"
        }
      ],
      easing: 'easeInOutSine',
      duration: 200
    });
    //commentInput.blur()
    //nameInput.focus()
  }
}

/** Displays the buttom click animation. */
var ringBase;
ringBase = document.createElement("div");
ringBase.className = "ring";

function displayRing() {
  displayToast("some tast", "")
  const ring = ringBase.cloneNode(true);
  button.parentElement.appendChild(ring);
  anime({
    targets: ring,
    scale: 2.5,
    opacity: 0,
    easing: 'easeInOutSine',
    duration: 500
  }).finished.then(() => {
    ring.remove()
  });
}

/** Displays a click (Killfeed-like-style). */
function displayClick(click) {
  let text = `${click.name} verzweifelt...`
  // add comment in braces if present
  if (click.comment != undefined && click.comment != "") {
    text = text.concat(` (${click.comment})`);
  }
  displayToast(text, click.style);
}
var toastBase;
toastBase = document.createElement("div");
toastBase.className = "toast";

function displayToast(string, effectClass) {
  // prevent extreme amounts of comment messages
  if (anker.childElementCount > MAX_TOASTS)
    anker.lastElementChild.remove();

  const toast = toastBase.cloneNode(true);
  toast.className = [effectClass, "toast"].join("");
  toast.textContent = string;
  //tfrag.prepend(toast);
  anker.prepend(toast);
  anime.set(toast, {translateY:'100%'})
  var animation = anime.timeline({
    targets: toast,
    duration: 500,
    endDelay: 1000
  }).add({
    translateY: 0,
    translateX: 50,
    opacity: 1,
  }).add({
    translateX: -50,
    endDelay: 0
  }).add({
    translateY: '-100%',
    opacity: 0
  })
  animation.finished.then(() => {
    toast.remove();
  });
  hideDelay(toast, 1500);
  //destroyDelay(toast, 3000);
}


//code for the fps counter
const times = [];
let fps;

function refreshLoop() {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;

    today.textContent = statsDisplay.day;
    session.textContent = statsDisplay.session;
    online.textContent = statsDisplay.online;
    refreshLoop();
  });
}
refreshLoop();

function updateFps() {
  document.getElementById("fps").textContent = fps;
}
