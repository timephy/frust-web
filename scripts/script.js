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


// Socket.io
socket.on("stats", (stats) => {
  console.log(`stats(${stats["total"]}, ${stats["day"]})`);
  currentStats = stats;
  displayStats(stats["total"], stats["day"]);
});

socket.on("users", (users) => {
  console.log(`users(${users["count"]})`);
  displayOnlineUsers(users["count"]);
});

socket.on("click", (click) => {
  console.log(`click(${click["name"]}, ${click["comment"]}, ${click["style"]})`);

  displayClick(click["name"], click["comment"], click["style"])
  incrementStats()
  displayStats(currentStats["total"], currentStats["day"]);
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
