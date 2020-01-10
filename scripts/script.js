navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

const MAX_TOASTS = 35; //please increase if you find any device that needs it


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
  "day": 0
};
var sessionClicks = 0;

function toggleDarkmode(){
  if (localStorage.getItem("theme")) {
    if (localStorage.getItem("theme") == "dark") {
      localStorage.setItem("theme", "light");
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      localStorage.setItem("theme", "dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  } else {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
  }
  console.log("darkmode   " + localStorage.getItem("theme"))
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

    if (["green", "purple", "blue", "yellow", "black", "white"].includes(command)) {
      // Color
      storage.color = command;
    } else if (["small", "big", "dotted", "dashed"].includes(command)) {
      // Underline, Size
      storage.underlineType = command;
    } else if (["fuck", "einstein", "satan", "666", "pride", "fireworks", "rickroll"].includes(command)) {
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
        case "darkmode":
          toggleDarkmode();
          break;
        case "rainbow":
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
        default:
          // No command matched
          alert("Kommando nicht valide.");
          break;
      }
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
  randomButtonLabel();
  displayRing();
}


// Socket.io
socket.on("stats", (stats) => {
  console.log(`stats(${stats["total"]}, ${stats["day"]})`);
  currentStats = stats;
  displayStats(currentStats["total"], currentStats["day"]);
});

socket.on("users", (users) => {
  console.log(`users(${users["count"]})`);
  displayOnlineUsers(users["count"]);
});

socket.on("click", (click) => {
  console.log(`click(${click["name"]}, ${click["comment"]}, ${click["style"]})`);

  displayClick(click["name"], click["comment"], click["style"])
  incrementStats();
  displayStats(currentStats["total"], currentStats["day"]);
});

socket.on("event", (event) => {
  console.log(`event(${event["name"]}, ${event["id"]})`);

  // FIXME: for testing displayClick
  displayToast(event["name"] + " triggered " + event["id"])

  // Reacting to "everyone events"
  switch (event["id"]) {
    case "pride":
      addTemporaryClass(button, "rainbow", 8000);
      break;
    case "satan":
      addTemporaryClass(button, "teemo", 5000);
      break;
    case "666":
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
    case "rickroll":
      open("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      break;
  }
});

socket.connect();
