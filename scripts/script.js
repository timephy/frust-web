const MAX_TOASTS = 30; //please increase if you find any device that needs it
const MAX_TOAST_BUFFER = 60;
const BUFFER_DURATION = 1000;
var EMIT_DURATION = BUFFER_DURATION / MAX_TOAST_BUFFER;
var savedByBuffer = 0;
var bufferActive = true;

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

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
  updateDark(newTheme);
}

function updateDark(newTheme) {
  localStorage.setItem("theme", newTheme);
  document.documentElement.setAttribute("data-theme", newTheme);
  console.log("darkmode   " + localStorage.getItem("theme"));

  //forces a redraw of the background... supposedly
  document.documentElement.style.display = "none";
  document.documentElement.offsetHeight; // no need to store this anywhere, the reference is enough
  document.documentElement.style.display = "block";
}

/** The main button action. */
function verzweifle() {
  if (navigator.onLine) {

    if (navigator.vibrate && storage.vibration) // vibration API supported
      navigator.vibrate(50);

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
      console.log(`command: "${command}"`);

      if (["green", "purple", "blue", "yellow", "black", "white"].includes(command)) {
        // Color
        storage.color = command;
      } else if (["small", "big", "dotted", "dashed", "highlight", "fire", "fancy"].includes(command)) {
        // Underline, Size
        storage.underlineType = command;
      } else if (["fuck", "belasto", "einstein", "satan", "666", "fu", "pride", "fireworks", "rickroll"].includes(command)) {
        // Global events
        socket.emit("event", {
          "user": name,
          "name": command
        });
      } else {
        switch (command) {
          case "vibrate":
            storage.vibration = !storage.vibration;
            console.log("vibrationsActive   ", storage.vibration);
            break;
          // case "belastos":
          //   for (var i = 0; i < 20; i++) {
          //     socket.emit("event", {
          //       "user": "God",
          //       "name": "belasto"
          //     });
          //   }
          //   break;
          case "fps":
            setInterval(updateFps, 500);
            const fpsElem = document.createElement("div");
            fpsElem.id = "fps";
            fpsElem.textContent = "000";
            panker.appendChild(fpsElem);
            break;
          case "buffer":
            alert(savedByBuffer + " toasts have been prevented by the buffer\n" + (bufferActive ? "deactivating buffer" : "activating buffer"));
            savedByBuffer = 0;
            bufferActive = !bufferActive;
            break;
          case "gtest": //testing performance if glogal clicks are emitted
            let gtest = 0;
            const gintervalId = setInterval(() => {
              for (var i = 0; i < 5; i++) {
                gtest++;
                socket.emit("click", {
                  "user": `${gtest} gtest `,
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
              displayToast(`${test} test message num ${test}`, "");
              displayToast(`${test} test message num ${test}`, "");
              displayToast(`${test} test message num ${test}`, "");
              displayToast(`${test} test message num ${test}`, "");
              displayToast(`${test} test message num ${test}`, "");
              displayToast(`${test} test message num ${test}`, "");
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
          case "exmatrikulation":
          case "zudummfürtum":
            window.location.href = "https://www.tum.de/studium/studienabschluss/exmatrikulation/";
            break;
          case "stats":
          case "users":
            window.location.href = "/stats.html";
            break;
          case "rainbow":
            console.log("-> rainbow");
            let hue = 0;
            const intervalId = setInterval(() => {
              hue++;
              hue = hue % 360;
              document.documentElement.style.setProperty('--font-color', 'hsl(' + hue + ', 60%, 50%)');
            }, 16);
            setTimeout(() => {
              clearInterval(intervalId);
              document.documentElement.style.removeProperty("--font-color");
            }, 10000);
            break;
          case "clear":
            storage.color = "";
            storage.underlineType = "";
            localStorage.removeItem("theme");
            break;
          case "help":
            alert(HELP_MESSAGE);
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
        "user": name,
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
socket.on("stats", stats => {
  console.log("stats", stats);

  statsDisplay.total = stats["click_count_total"];
  statsDisplay.day = stats["click_count_today"];
});

socket.on("status", status => {
  console.log("status", status);

  statsDisplay.online = status["user_count"];
});

socket.on("message", message => {
  console.log("message", message);

  if (message["type"] == "toast") {
    displayToast(message["text"], message["style"]);
  } else if (message["type"] == "popup") {
    popup(message["text"], "fu");
  }
});

socket.on("click", click => {
  console.log("click", click);
  constrainClicks(click["user"], click["comment"], click["style"]);

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
      "name": n,
      "comment": c,
      "style": s
    });
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

socket.on("event", event => {
  console.log("event", event);

  // Reacting to "everyone events"
  ({
    pride: () => addTemporaryClass(button, "rainbow", 8000),
    satan: () => addTemporaryClass(button, "teemo", 5000),
    666: () => addTemporaryClass(button, "elmo", 5000),
    fu: () => addTemporaryClass(button, "fu-meme", 5000),
    fuck: () => popup("Fuck you", "fu"),
    fireworks: () => popup("", "fireworks"),
    einstein: () => einstein(),
    belasto: () => belasto(),
    rickroll: () => {
      window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    }
  } [event["name"]]());
});

socket.on("connect", () => {
  console.log("connect");

  // Send name to server
  socket.emit("auth", storage.name || "Gast")
});

socket.connect();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("/sw.js").then(
      registration => console.log(
        "ServiceWorker registration successful with scope: ",
        registration.scope
      ),
      err => console.log("ServiceWorker registration failed: ", err)
    );
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

window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);
updateOnlineStatus();
