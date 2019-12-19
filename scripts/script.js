var btnElem = document.getElementById("mainButton")
var anker = document.getElementById("toastAnker")
var nameInput = document.getElementById("nameInput")
var todayDisp = document.getElementById("todayDisp")
var totalDisp = document.getElementById("totalDisp")

var totalClicks = 3000;
var todaysClicks = 735;

var storage = window.localStorage

var options = [
  "Exmatrikulation",
  "GOP",
  "noch Fragen?",
  "fresh Hermann",
  "E1GeNv3kToR"
]

var prevName = "guest";
var NAME_KEY = "frust_name"
var CLICK_KEY = "clikkks"

function verzweifle() {
  if (validatedText(nameInput.value) != prevName) {
    prevName = validatedText(nameInput.value)
    storage.setItem(NAME_KEY, prevName)
  }

  // Display creative and original message
  if (Math.random() > 0.85) {
    btnElem.value = options[Math.floor(Math.random() * options.length)]
  } else {
    btnElem.value = "ich verzweifle"
  }

  // keep track of the clicks
  todaysClicks++;
  totalClicks++;
  storage.setItem(CLICK_KEY, totalClicks)
  totalDisp.innerText = "total \n "+totalClicks
  todayDisp.innerText = "today \n "+todaysClicks

  if (totalClicks % 1000 == 0) {
    btnElem.classList.add("rainbow")
  } else if (totalClicks % 1000 == 1) {
    btnElem.classList.remove("rainbow")
  }

  // Purely Visual
  spawnRing()
  toast(prevName)
}

function validatedText(input) {
  var validatedInput = "jemand"
  if (input.trim() != "") {
    validatedInput = input.trim()
  }
  return validatedInput
}

function spawnRing() {
  var ring = document.createElement("div")
  ring.className = "ring";
  btnElem.parentElement.appendChild(ring)
  window.getComputedStyle(ring).opacity
  ring.classList.add("show")
  destroyDelay(ring, 700)
}

function toast(name) {
  var toast = document.createElement("div")
  toast.className = "toast"
  toast.appendChild(document.createTextNode(name + " ist gerade verweifelt..."))
  anker.appendChild(toast)
  window.getComputedStyle(toast).opacity
  toast.classList.add("show")
  hideDelay(toast)
  destroyDelay(toast, 2500)
}

function hideDelay(element) {
  var e = element
  setTimeout(function() {
    e.classList.add("hide")
  }, 1500)
}

function destroyDelay(element, time) {
  var e = element
  setTimeout(function() {
    e.parentElement.removeChild(e)
  }, time)
}

function loadFiles() {
  if (storage.getItem(NAME_KEY))
    prevName = storage.getItem(NAME_KEY); // load from local storage
    
  if (storage.getItem(CLICK_KEY)) 
    totalClicks = storage.getItem(CLICK_KEY);

totalDisp.innerText = "total \n " + totalClicks
  nameInput.value = prevName //Display the loaded name
}

document.body.onload = loadFiles()
