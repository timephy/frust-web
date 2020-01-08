const button = document.getElementById("mainButton");
const anker = document.getElementById("toastAnker");
const wrapper = document.getElementById("wrapper");
const panker = document.getElementById("popupAnker");
const nameInput = document.getElementById("nameInput");
const commentInput = document.getElementById("commentInput");
const todayDisp = document.getElementById("todayDisp");
const totalDisp = document.getElementById("totalDisp");
const usersDisp = document.getElementById("stats");

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

const MAX_TOASTS = 35; //please increase if you find any device that needs it
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


document.body.onload = () => {
  // set name, comment
  nameInput.value = storage.name;
  commentInput.value = storage.comment;
};

const socket = io({
  path: "/api/socket.io"
});

// Stats
var currentStats = {
  "total": 0,
  "day": 0,
  "hour": 0
};
var sessionClicks = 0;

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

/** The main button action. */
function verzweifle() {

  if (navigator.vibrate && storage.vibration) { // vibration API supported
    navigator.vibrate(100);
  }

  // Inputs
  let sanitizedName = sanitizeInput(nameInput.value);
  if (sanitizedName != storage.name)
    storage.name = sanitizedName;
  let name = sanitizedName || "Gast"; // or default name

  let sanitizedComment = sanitizeInput(commentInput.value);
  // commands are not saved
  if (sanitizedComment != storage.comment && !sanitizedComment.startsWith("/"))
    storage.comment = sanitizedComment;
  let comment = sanitizedComment || "";

  if (comment.startsWith("/")) { // Command
    command = comment.substring(1);

    switch (command) {
      case "vibrate":
        storage.vibration = !storage.vibration;
        console.log("vibrationsActive   " + storage.vibration)
        break;
      case "darkmode":
        if (localStorage.getItem("theme")) {
          if (localStorage.getItem("theme") == "dark")
            localStorage.setItem("theme", "light");
          else
            localStorage.setItem("theme", "dark");
        }
        console.log("darkmode   " + localStorage.getItem("theme"))
        break;
      case "rainbow":
        addTemporaryClass(wrapper, "rainbowColor", 8000);
        break;
      case "green":
      case "purple":
      case "blue":
      case "yellow":
      case "black":
      case "white":
        storage.color = command;
        break;
      case "clear":
        storage.color = ""
        storage.underlineType = ""
        break;
      case "small":
      case "big":
      case "dotted":
      case "dashed":
        storage.underlineType = command;
        break;
      case "fuck":
      case "einstein":
      case "satan":
      case "gaypride":
      case "fireworks":
        socket.emit("event", {
          "id": command
        });
        break;
      default:
        // No command matched
        alert("Kommando nicht valide.");
        break;
    }
    commentInput.value = "";
  } else { // Click
    socket.emit("click", {
      "name": name,
      "comment": comment,
      "style": [storage.underlineType, storage.color].join(" ")
    });
  }

  // Purely Visual
  // Display creative and original message
  sessionClicks++;
  button.innerText = randomButtonLabel() + '\n' + sessionClicks;
  displayRing();
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
  // prevent extreme amounts of comment messages
  if (anker.childElementCount > MAX_TOASTS)
    anker.lastElementChild.remove();

  let text = `${name} verzweifelt...`
  // add comment in braces if present
  if (comment != undefined && comment != "") {
    text = text.concat(` (${comment})`);
  }

  const toast = document.createElement("div")
  toast.className = [toastType, effectClass].join(" ");
  toast.appendChild(document.createTextNode(text));
  anker.prepend(toast);
  hideDelay(toast, 2500);
  destroyDelay(toast, 3000);
}




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
  console.log(`click(${click["name"]}, ${click["comment"]}, ${click["style"]})`);

  displayClick(click["name"], click["comment"], click["style"])
  incrementStats()
  displayStats(currentStats["total"], currentStats["day"], currentStats["hour"]);
});

socket.on("event", (event) => {
  console.log(`event(${event["id"]})`);

  // Reacting to "everyone events"
  switch (event["id"]) {
    case "gaypride":
      addTemporaryClass(button, "rainbow", 8000);
      break;
    case "satan":
      addTemporaryClass(button, "elmo", 3000);
      break;
    case "fuck":
      popup("Fuck you", "fu");
      break;
    case "fireworks":
      fireworks()
      break;
    case "einstein":
      einstein();
      break;
  }
});

socket.connect();
