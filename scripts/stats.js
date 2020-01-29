window.addEventListener('load', () => {
  loadJson((error, result) => {
    if (error)
      console.log(error);
    CreateUserTableFromJSON(result, 'showOnlineUsers', 'Nutzer (online)');
  }, '/api/online_users');

  loadJson((error, result) => {
    if (error)
      console.log(error);
    CreateTableFromJSON(result, 'showUsers', 'Nutzer (alle)');
  }, '/api/users');

  loadJson((error, result) => {
    if (error)
      console.log(error);

    result = groupBy(result, click => click.user + "\n" + click.comment)
    result = Object.entries(result).map((key) => {
      // console.log(key);
      const clicks = key[1];
      const firstClick = clicks[0];
      return {
        count: clicks.length,
        user: firstClick.user,
        comment: firstClick.comment
      };
    });
    result = result.sort((a, b) => b.count - a.count);

    CreateTableFromJSON(result, 'latest-clicks', 'Klicks (heute)');
  }, '/api/latest_clicks');

  loadJson((error, result) => {
    if (error)
      console.log(error);

    console.log("raw result ", result)
    result = groupBy(result, event => event.user + "\n" + event.name)
    console.log("grouped result ", result)
    result = Object.entries(result).map((key) => {
      // console.log(key);
      const events = key[1];
      const firstEvent = events[0];
      return {
        count: events.length,
        user: firstEvent.user,
        event: firstEvent.name
      };
    });
    result = result.sort((a, b) => b.count - a.count);
    // console.log("final result ", result)

    CreateTableFromJSON(result, 'latest-events', 'Events (heute)');
  }, '/api/latest_events');

  loadJson((error, result) => {
    if (error)
      console.log(error);
    CreateTableFromJSON(result, 'latest-hours', 'Stunden (heute)');
  }, '/api/latest_hours');

  loadJson((error, result) => {
    if (error)
      console.log(error);
    CreateTextFromJSON(result, 'versionData', 'Frontend version:');
  }, '/version.json');

  loadJson((error, result) => {
    if (error)
      console.log(error);
    CreateTextFromJSON(result, 'api-version', 'Backend version:');
  }, '/api');
  makeChart();
  makeLineChart();
});

function makeChart() {
  var ctx = document.getElementById('eventChart');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: 'Events',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(183, 28, 28, 1)',
          'rgba(127, 0, 0, 1)',
          'rgba(183, 28, 28, 1)',
          'rgba(127, 0, 0, 1)',
          'rgba(183, 28, 28, 1)',
          'rgba(127, 0, 0, 1)',
        ],
        borderColor: [
          'rgba(127, 0, 0, 1)',
          'rgba(183, 28, 28, 1)',
          'rgba(127, 0, 0, 1)',
          'rgba(183, 28, 28, 1)',
          'rgba(127, 0, 0, 1)',
          'rgba(183, 28, 28, 1)',
        ],
        borderWidth: 2
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

function makeLineChart() {
  var ctx = document.getElementById('hourChart');
  var myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'hourly clicks',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(183, 28, 28, 0.2)',
            'rgba(127, 0, 0, 0.2)',
            'rgba(183, 28, 28, 0.2)',
            'rgba(127, 0, 0, 0.2)',
            'rgba(183, 28, 28, 0.2)',
            'rgba(127, 0, 0, 0.2)',
          ],
          borderColor: [
            'rgba(127, 0, 0, 1)',
            'rgba(183, 28, 28, 1)',
            'rgba(127, 0, 0, 1)',
            'rgba(183, 28, 28, 1)',
            'rgba(127, 0, 0, 1)',
            'rgba(183, 28, 28, 1)',
          ],
          borderWidth: 2
        }]
      },
    options: {}
  });
}


function CreateUserTableFromJSON(jsonData, eid, caption) {
  ownuser = {
    name: storage.name || "Gast"
  }
  jsonData.push(ownuser);
  // console.log(jsonData);

  CreateTableFromJSON(jsonData, eid, caption);
}

function CreateTableFromJSON(jsonData, eid, caption) {
  var col = [];
  for (var i = 0; i < jsonData.length; i++)
    for (var key in jsonData[i])
      if (col.indexOf(key) === -1)
        col.push(key);

  // CREATE DYNAMIC TABLE.
  var table = document.createElement("table");

  //CREATE TABLE CAPTION
  var cap = table.createCaption();
  cap.textContent = caption;



  var tr; // TABLE ROW.

  // ADD JSON DATA TO THE TABLE AS ROWS.
  for (var i = 0; i < jsonData.length; i++) {
    tr = table.insertRow(-1);
    for (var j = 0; j < col.length; j++) {
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = jsonData[i][col[j]];
    }
  }

  // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
  var head = table.createTHead();

  tr = head.insertRow(-1);
  for (var i = 0; i < col.length; i++) {
    var th = document.createElement("th"); // TABLE HEADER.
    th.innerHTML = col[i];
    tr.appendChild(th);
  }

  // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
  const divContainer = document.getElementById(eid);
  divContainer.innerHTML = "";
  divContainer.appendChild(table);
}

function CreateTextFromJSON(jsonData, eid, caption) {
  console.log(jsonData);

  const txt = document.createElement("h2");
  txt.textContent = [caption, JSON.stringify(jsonData, null, 4)].join(" ");
  const divContainer = document.getElementById(eid);
  divContainer.innerHTML = "";
  divContainer.appendChild(txt);
}

function groupBy(array, kf) {
  const result = array.reduce(function(r, a) {
    key = kf(a)
    r[key] = r[key] || [];
    r[key].push(a);
    return r;
  }, Object.create(null));
  return result
}
