navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

const MAX_TOASTS = 30; //please increase if you find any device that needs it
const MAX_TOAST_BUFFER = 60;
const BUFFER_DURATION = 1000;
var EMIT_DURATION = BUFFER_DURATION / MAX_TOAST_BUFFER;
var savedByBuffer = 0;
var bufferActive = true;
var devMode = false;

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

  //forces a redraw of the background... supposedly
  document.documentElement.style.display = 'none';
  document.documentElement.offsetHeight; // no need to store this anywhere, the reference is enough
  document.documentElement.style.display = 'block';
}

/** The main button action. */
function verzweifle() {
  if (navigator.onLine && !devMode) {

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
      // remove comment to "hide command"
      commentInput.value = "";
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
            console.log("vibrationsActive   ", storage.vibration)
            break;
          case "fps":
            setInterval(updateFps, 500);
            const fpsElem = document.createElement("div")
            fpsElem.id = "fps";
            fpsElem.textContent = "000";
            panker.appendChild(fpsElem);
            break;
          case "buffer":
            alert(savedByBuffer + " toasts have been prevented by the buffer\n" + (bufferActive ? "deactivating buffer" : "activating buffer"));
            savedByBuffer = 0;
            bufferActive = !bufferActive;
            break;
          case "ctest": //testing buffered performance (locally)
            let ctest = 0;
            const cintervalId = setInterval(() => {
              ctest++;
              constrainClicks(`${ctest} test ${ctest}`, "", "")
            }, 5);
            setTimeout(() => {
              clearInterval(cintervalId);
            }, 5000);
            break;
          case "gtest": //testing performance if glogal clicks are emitted
            let gtest = 0;
            const gintervalId = setInterval(() => {
              for (var i = 0; i < 5; i++) {
                gtest++;
                socket.emit("click", {
                  "name": `${gtest} gtest `,
                  "comment": `${gtest}`,
                  "style": [storage.underlineType, storage.color].join(" ")
                });
              }
            }, 20);
            setTimeout(() => {
              clearInterval(gintervalId);
            }, 2000);
            break;
          case "test": //testing the combined toast ring performance
            let test = 0;
            const tintervalId = setInterval(() => {
              test++;
              displayToast(`${test} test message num ${test}`, "")
              displayToast(`${test} test message num ${test}`, "")
              displayToast(`${test} test message num ${test}`, "")
              displayToast(`${test} test message num ${test}`, "")
              displayToast(`${test} test message num ${test}`, "")
              displayToast(`${test} test message num ${test}`, "")
              displayRing();
            }, 5);
            setTimeout(() => {
              clearInterval(tintervalId);
            }, 5000);
            break;
          case "rtest": //testing the ring performance
            let rtest = 0;
            const rintervalId = setInterval(() => {
              rtest++;
              displayRing();
            }, 5);
            setTimeout(() => {
              clearInterval(rintervalId);
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
    } else { // Click
      statsDisplay.session++;
      socket.emit("click", {
        "name": name,
        "comment": comment,
        "style": [storage.underlineType, storage.color].join(" ")
      });
    }
  } else {
    if (devMode) {
      displayClick({
        name: "dev",
        comment: commentInput.value,
        style: ""
      });
    } else {

      displayToast("Du bist OFFLINE und verzweifelst alleine", "");
    }
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
  constrainClicks(click["name"], click["comment"], click["style"]);

  statsDisplay.total++;
  statsDisplay.day++;
});

//buffering logic, allows a maximum of 60 toasts/second
let bufferedClicks = [];

//collects all the incoming clicks
function constrainClicks(n, c, s) {
  if (bufferActive) {
    if (bufferedClicks.length < MAX_TOAST_BUFFER) {
      bufferedClicks.push({
        name: n,
        comment: c,
        style: s
      });
    } else {
      console.log("a click got dismissed (buffer full)");
      savedByBuffer++;
    }
  } else {
    displayClick({
      name: n,
      comment: c,
      style: s
    })
  }

}
setInterval(emitClicks, EMIT_DURATION);

//emits the buffered clicks over an extended period of time
function emitClicks() {
  if (bufferedClicks.length > 0) {
    //console.log(bufferedClicks.length + " clicks are in the buffer");
    displayClick(bufferedClicks.shift());
  }
}

socket.on("event", (event) => {
  console.log(`event(${event["name"]}, ${event["id"]})`);
  displayToast(`${event["name"]} triggered ${event["id"]}!`, "")

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

socket.connect();

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

function updateOnlineStatus() {
  document.getElementById("offlineMessage").style.display = navigator.onLine ? "none" : "block";
}

function process(e) {
  const code = e.keyCode ? e.keyCode : e.which;
  if (code == 13) {
    verzweifle();
    e.preventDefault();
  }
}

devMode = !window.location.href.includes('https');
console.log("dev mode: ", devMode);
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
