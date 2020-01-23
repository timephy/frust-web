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
  "Syntax:  /{command}",
  "Click colors:",
  "    " + ["green", "purple", "blue", "yellow", "black", "white"].join(", "),
  "Click lines:",
  "    " + ["small", "big", "dotted", "dashed"].join(", "),
  "Events:",
  "    " + ["exmatrikulation","einstein", "belasto", "fireworks", "satan", "666", "pride", "rainbow", "fu"].join(", "),
  "Options:",
  "    " + ["vibrate", "darkmode", "clear"].join(", "),
  "Dev options:",
  "    " + ["buffer", "fps", "test", "rtest"].join(", ")
].join("\n")

/** effect variables */
const resetableTimers = {};
const RESET_TIME = 4000;
const activeToasts = {}

const tfrag = document.createDocumentFragment();

/** A helper class to manage and update current stats. */
class StatsDisplay {
  // total
  get total() {
    return this._total || 0;
  }
  set total(value) {
    this._total = value;
    total.textContent = this.total;

    if (value % 100000 == 0) {
      popup("+100.000")
    } else if (value % 10000 == 0) {
      popup("+10.000")
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

/** Einstein effect. */
function einstein() {
  const einstein = document.createElement("span")
  einstein.className = "einstein";
  anime.set(einstein, {
    top: anime.random(-10, 90)+ '%',
    left: anime.random(-10, 90) + '%',
  });

  panker.appendChild(einstein);
  destroyDelay(einstein, 5000);
}

function belasto() {
  const belasto = document.createElement("span")
  belasto.className = "belasto"
  anime.set(belasto, {
    top: anime.random(-10, 90)+ '%',
    left: anime.random(-10, 90) + '%',
  });

  anime({
    targets: belasto,
    rotate: anime.random(-30, 30)+'deg',
    scale: [0.4, 1]
  })
  destroyDelay(belasto, 30000);

  wrapper.appendChild(belasto);
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
      duration: 500,
      delay: -150,
      easing: 'easeInOutExpo'
    });
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
      duration: 500,
      delay: -150,
      easing: 'easeInOutExpo'
    });
  }
}

/** Displays the buttom click animation. */
const ringBase = document.createElement("div");
ringBase.className = "ring";

function displayRing() {
  const ring = ringBase.cloneNode(true);
  button.parentElement.appendChild(ring);
  destroyDelay(ring, 700)
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

function displayToast(string, effectClass) {
  var tid = string+effectClass;
  if (activeToasts[tid] !== undefined) {
    atoast = activeToasts[tid];
    clearTimeout(atoast[2])
    //create a new timer instance
    atoast[2] = setTimeout(atoast[3], RESET_TIME)
    if (atoast[4] == 1)
      anime.set(atoast[1], {
        display: 'block'
      });
    atoast[4]++;
    atoast[1].textContent = atoast[4];

    //set counter position
    anime.set(atoast[1], {
      right: (-anime.get(atoast[1], 'width', 'rem') - 1.2) + 'rem'
    })

    anime.timeline({
      targets: atoast[1]
    }).add({
      scale: [0.5, 1],
      translateY: (anime.random(-100, 100) / 200) + 'rem',
      translateX: (anime.random(-100, 100) / 200) + 'rem',
      opacity: 1,
      duration: 100,
      easing: 'easeOutSine',
    }).add({
      translateY: 0,
      translateX: 0,
      opacity: 1,
      duration: 100,
      easing: 'easeOutSine',
      endDelay: RESET_TIME - 1200,
    }).add({
      easing: 'easeInSine',
      scale: 0.2,
      opacity: 0,
      duration: 1000
    })
  } else {
    newToast(string, effectClass);
  }
}

const toastBase = document.createElement("div");
const clickCounter = document.createElement("div");

function newToast(string, effectClass) {
  // prevent extreme amounts of comment messages
  if (anker.childElementCount > MAX_TOASTS)
    anker.lastElementChild.remove();

  const toast = toastBase.cloneNode(true);
  const count = clickCounter.cloneNode(true);
  //function that hides, animates and deletes the toast when executed
  function funkyFunc() {
    toast.classList.add("hide")
    count.remove()
    delete activeToasts[string];
    const animation = anime({
      targets: toast,
      delay: 500,
      duration: 250,
      padding: 0,
      margin: 0,
      'max-height': 0,
      opacity: 0,
      easing: 'easeInSine'
    })
    // toast.remove has to be evaluated while in DOM, otherwise undefined?
    animation.finished.then(() => toast.remove());
  }

  // save the toast with his resetable timer and removal function
  activeToasts[string+effectClass] = [toast, count, setTimeout(funkyFunc, RESET_TIME), funkyFunc, 1];

  toast.className = [effectClass, "toast"].join(" ");
  count.className = [effectClass, "clickCounter"].join(" ");
  toast.textContent = string;
  toast.appendChild(count)
  tfrag.prepend(toast);
  /* currently using the css animation from before
  anime({
    targets: toast,
    maxheight: [0,'4em'],
    duration: 500,
    opacity: 1,
    translateY: ['100%',0]
  })*/
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

    anker.prepend(tfrag);

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
