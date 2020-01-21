/** Returns whether the given string if "on" or "off". */
const stringIsBool = (str) => str == "on" || str == "off";

/** String corrections for input fields. */
const sanitizeInput = (input) => input.trim();

/** Adds hide class to element after specified time. */
function hideDelay(element, time) {
  setTimeout(() => element.classList.add("hide"), time);
}

/** Removes the element from its parent after specified time. */
function destroyDelay(element, time) {
  setTimeout(() => element.remove(), time);
}

/** Adds the class to element and then removes it after a delay. */
function addTemporaryClass(targetElem, cssClass, time) {
  if (!!resetableTimers[cssClass]) {
    clearTimeout(resetableTimers[cssClass])
  }
  targetElem.classList.add(cssClass);
  resetableTimers[cssClass] = setTimeout(() => targetElem.classList.remove(cssClass), time);
  console.log(cssClass + ": timer " + resetableTimers[cssClass])
}

function CreateUserTableFromJSON(jsonData, eid) {
  console.log(jsonData);
  // EXTRACT VALUE FOR HTML HEADER.
  var col = [];
  for (var i = 0; i < jsonData.identifiedUsers.length; i++) {
    for (var key in jsonData.identifiedUsers[i]) {
      if (col.indexOf(key) === -1) {
        col.push(key);
      }
    }
  }

  // CREATE DYNAMIC TABLE.
  var table = document.createElement("table");

  // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

  var tr = table.insertRow(-1); // TABLE ROW.

  for (var i = 0; i < col.length; i++) {
    var th = document.createElement("th"); // TABLE HEADER.
    th.innerHTML = col[i];
    tr.appendChild(th);
  }

  // ADD JSON DATA TO THE TABLE AS ROWS.
  for (var i = 0; i < jsonData.identifiedUsers.length; i++) {

    tr = table.insertRow(-1);

    for (var j = 0; j < col.length; j++) {
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = jsonData.identifiedUsers[i][col[j]];
    }
  }

  // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
  var divContainer = document.getElementById(eid);
  divContainer.innerHTML = "user count: " + jsonData.userCount + "<br><br>";
  divContainer.appendChild(table);
}

function CreateTableFromJSON(jsonData, eid) {
  const col = [];
  for (const i = 0; i < jsonData.length; i++)
    for (const key in jsonData[i])
      if (col.indexOf(key) === -1)
        col.push(key);

  // CREATE DYNAMIC TABLE.
  const table = document.createElement("table");

  // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
  const tr = table.insertRow(-1); // TABLE ROW.

  for (const i = 0; i < col.length; i++) {
    const th = document.createElement("th"); // TABLE HEADER.
    th.innerHTML = col[i];
    tr.appendChild(th);
  }

  // ADD JSON DATA TO THE TABLE AS ROWS.
  for (const i = 0; i < jsonData.length; i++) {
    tr = table.insertRow(-1);

    for (const j = 0; j < col.length; j++) {
      const tabCell = tr.insertCell(-1);
      tabCell.innerHTML = jsonData[i][col[j]];
    }
  }

  // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
  const divContainer = document.getElementById(eid);
  divContainer.innerHTML = "";
  divContainer.appendChild(table);
}

function CreateTextFromJSON(jsonData, eid) {
  console.log(jsonData);

  const txt = document.createElement("h2");
  txt.textContent = JSON.stringify(jsonData, null, 4);
  const divContainer = document.getElementById(eid);
  divContainer.innerHTML = "";
  divContainer.appendChild(txt);
}

function loadJson(callback, path) {
  fetch(path)
    .then(response => response.json())
    .then(json => callback(null, json))
    .catch(error => callback(error, {
      "error": "while fetching data, sorry"
    }));
}
