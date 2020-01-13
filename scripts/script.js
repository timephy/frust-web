navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

const MAX_TOASTS = 30; //please increase if you find any device that needs it
const MAX_TOAST_BUFFER = 60;
const BUFFER_DURATION = 1000;
var EMIT_DURATION = BUFFER_DURATION / MAX_TOAST_BUFFER;

document.body.onload = () => {
  // set name, comment
  nameInput.value = storage.name;
  commentInput.value = storage.comment;
};

const socket = io({
  path: "/api/socket.io"
});


function toggleDarkmode() {
  const newTheme = localStorage.getItem("theme") == "dark" ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  document.documentElement.setAttribute("data-theme", newTheme);

  console.log("darkmode   " + localStorage.getItem("theme"));

  document.documentElement.style.display = 'none';
  document.documentElement.offsetHeight; // no need to store this anywhere, the reference is enough
  document.documentElement.style.display = 'block';
}

/** The main button action. */
function verzweifle() {
  if (navigator.onLine) {

    if (navigator.vibrate && storage.vibration) // vibration API supported
      navigator.vibrate(100);

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
      console.log(`command: "${command}"`)

      if (["green", "purple", "blue", "yellow", "black", "white"].includes(command)) {
        // Color
        storage.color = command;
      } else if (["small", "big", "dotted", "dashed"].includes(command)) {
        // Underline, Size
        storage.underlineType = command;
      } else if (["fuck", "einstein", "satan", "666", "fu", "pride", "fireworks", "rickroll"].includes(command)) {
        // Global events
        socket.emit("event", {
          "name": name,
          "id": command
        });
      } else {
        switch (command) {
          case "vibrate":
            storage.vibration = !storage.vibration;
            console.log("vibrationsActive   " + storage.vibration)
            break;
          case "fps":
            refreshLoop();
            setInterval(updateFps, 500);
            const fpsElem = document.createElement("div")
            fpsElem.id = "fps";
            fpsElem.textContent = "000";
            panker.appendChild(fpsElem);
            break;
          case "test":
            let ctest = 0;
            const cintervalId = setInterval(() => {
              ctest++;
              displayToast(`${ctest} test message num ${ctest}`, "")
              displayRing();
            }, 5);
            setTimeout(() => {
              clearInterval(cintervalId);
            }, 5000);
            break;
          case "ctest":
            let test = 0;
            const tintervalId = setInterval(() => {
              test++;
              constrainClicks(`${test} test ${test}`, "", "")
            }, 5);
            setTimeout(() => {
              clearInterval(tintervalId);
            }, 5000);
            break;
          case "darkmode":
            toggleDarkmode();
            break;
          case "stats":
          case "users":
            window.location.href = "/stats.html";
            break;
          case "rainbow":
            console.log("-> rainbow")
            let hue = 0;
            const intervalId = setInterval(() => {
              hue++;
              hue = hue % 360;
              document.documentElement.style.setProperty('--font-color', 'hsl(' + hue + ', 60%, 50%)');
            }, 16);
            setTimeout(() => {
              clearInterval(intervalId);
              document.documentElement.style.removeProperty('--font-color');
            }, 10000);
            break;
          case "clear":
            storage.color = ""
            storage.underlineType = ""
            break;
          case "help":
            alert(HELP_MESSAGE)
            break;
          default:
            // No command matched
            alert("Kommando nicht valide.");
            break;
        }
      }
      // remove comment to "hide command"
      commentInput.value = "";
    } else { // Click
      statsDisplay.session++;
      socket.emit("click", {
        "name": name,
        "comment": comment,
        "style": [storage.underlineType, storage.color].join(" ")
      });

    }
  } else {
    displayToast("Du bist OFFLINE und verzweifelst alleine", "");
  }

  // Purely Visual
  // Display creative and original message
  displayRandomButtonLabel();
  displayRing();
}


// Socket.io
socket.on("stats", (stats) => {
  console.log(`stats(${stats["total"]}, ${stats["day"]})`);
  statsDisplay.total = stats["total"];
  statsDisplay.day = stats["day"];
});

socket.on("users", (users) => {
  console.log(`users(${users["count"]})`);
  statsDisplay.online = users["count"];
});

socket.on("click", (click) => {
  console.log(`click(${click["name"]}, ${click["comment"]}, ${click["style"]})`);

  constrainClicks(click["name"], click["comment"], click["style"]);

  statsDisplay.total++;
  statsDisplay.day++;
});

//buffering logic, allows a maximum of 60 toasts/second
let bufferedClicks = [];

function constrainClicks(n, c, s) {
  if (bufferedClicks.length < MAX_TOAST_BUFFER)
    bufferedClicks.push({
      name: n,
      comment: c,
      style: s
    });
}
setInterval(emitClicks, EMIT_DURATION);

function emitClicks() {
  if (bufferedClicks.length > 0) {
    console.log(bufferedClicks.length + " clicks are in the buffer");
    displayClick(bufferedClicks.shift());
  }
}

socket.on("event", (event) => {
  console.log(`event(${event["name"]}, ${event["id"]})`);

  displayToast(`${event["name"]} triggered ${event["id"]}!`)

  // Reacting to "everyone events"
  switch (event["id"]) {
    case "pride":
      addTemporaryClass(button, "rainbow", 8000);
      break;
    case "satan":
      addTemporaryClass(button, "teemo", 5000);
      break;
    case "666":
      addTemporaryClass(button, "elmo", 5000);
      break;
    case "fu":
      addTemporaryClass(button, "fu-meme", 5000);
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
    case "rickroll":
      window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      break;
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

function updateOnlineStatus(event) {
  if (navigator.onLine)
    document.getElementById("offlineMessage").style.display = "none";
  else
    document.getElementById("offlineMessage").style.display = "block";
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

socket.connect();
