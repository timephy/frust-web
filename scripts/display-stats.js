function makeChart(res, eid, caption) {
  const ctx = document.getElementById(eid);

  const lightRed = 'rgba(183, 28, 28, 1)'
  const darkRed = 'rgba(127, 0, 0, 1)'


  var header = document.createElement("H1");
  header.textContent = caption;
  ctx.parentElement.insertBefore(header, ctx);

  const colors = res.values.map((x, i) => i % 2 == 0 ? lightRed : darkRed);
  const bcolors = res.values.map((x, i) => i % 2 == 1 ? lightRed : darkRed);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: res.names,
      datasets: [{
        label: caption,
        data: res.values,
        backgroundColor: colors,
        borderColor: bcolors,
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

function makeLineChart(res, eid, caption) {
  const ctx = document.getElementById(eid);

  var header = document.createElement("H1");
  header.textContent = caption;
  ctx.parentElement.insertBefore(header, ctx);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: res.timestamps,
      datasets: [
        /*{
                label: 'events',
                backgroundColor: 'rgba(127, 0, 0, 1)',
                borderColor: 'rgba(183, 28, 28, 1)',
                data: res.events,
                fill: false,
                yAxisID: 'y-axis-2',
              },*/
        {
          label: 'Clicks',
          backgroundColor: 'rgba(240, 85, 69, 1)',
          borderColor: 'rgba(127, 0, 0, 1)',
          data: res.clicks,
          fill: false,
          yAxisID: 'y-axis-1',
        }
      ]
    },
    options: {
      responsive: true,
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Hours'
          }
        }],
        yAxes: [{
            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
            display: true,
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: 'Clicks'
            },
            id: 'y-axis-1',
          }
          /*, {
                      type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                      display: true,
                      position: 'right',
                      scaleLabel: {
                        display: true,
                        labelString: 'Clicks'
                      },
                      id: 'y-axis-2',

            // grid line settings
            gridLines: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          }*/
        ]
      }
    }
  });
}

function createTable(jsonData, eid, caption, columnMap) {
  const table = document.createElement("table");

  // caption
  var header = document.createElement("H1");
  header.textContent = caption;
  table.parentElement.insertBefore(header, table);

  // data
  for (const i in jsonData) {
    const tr = table.insertRow(-1);
    for (const key in columnMap) {
      const tabCell = tr.insertCell(-1);
      tabCell.innerHTML = jsonData[i][columnMap[key]];
    }
  }

  // header
  const head = table.createTHead();

  const tr = head.insertRow(-1);
  for (const key in columnMap) {
    const th = document.createElement("th");
    th.innerHTML = key;
    tr.appendChild(th);
  }

  // add table to document
  const divContainer = document.getElementById(eid);
  divContainer.innerHTML = ""; // remove loading message
  divContainer.appendChild(table);
}

// function CreateUserTableFromJSON(jsonData, eid, caption) {
//   ownuser = {
//     name: storage.name || "Gast",
//       event_count_session: 0,
//           click_count_session: 0,
//   }
//   jsonData.push(ownuser);
//   // console.log(jsonData);

//   CreateTableFromJSON(jsonData, eid, caption);
// }

// function CreateTableFromJSON(jsonData, eid, caption) {
//   var col = [];
//   for (var i = 0; i < jsonData.length; i++)
//     for (var key in jsonData[i])
//       if (col.indexOf(key) === -1)
//         col.push(key);

//   // CREATE DYNAMIC TABLE.
//   var table = document.createElement("table");

//   //CREATE TABLE CAPTION
//   var cap = table.createCaption();
//   cap.textContent = caption;



//   var tr; // TABLE ROW.

//   // ADD JSON DATA TO THE TABLE AS ROWS.
//   for (var i = 0; i < jsonData.length; i++) {
//     tr = table.insertRow(-1);
//     for (var j = 0; j < col.length; j++) {
//       var tabCell = tr.insertCell(-1);
//       tabCell.innerHTML = jsonData[i][col[j]];
//     }
//   }

//   // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
//   var head = table.createTHead();

//   tr = head.insertRow(-1);
//   for (var i = 0; i < col.length; i++) {
//     var th = document.createElement("th"); // TABLE HEADER.
//     th.innerHTML = col[i];
//     tr.appendChild(th);
//   }

//   // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
//   const divContainer = document.getElementById(eid);
//   divContainer.innerHTML = "";
//   divContainer.appendChild(table);
// }

function CreateTextFromJSON(jsonData, eid, caption) {
  console.log(jsonData);

  const txt = document.createElement("h4");
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
