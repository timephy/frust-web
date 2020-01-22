const testTable = [{
    "Name": "Einstein",
    "Nachricht": "Lineare Algebra",
    "Clicks": "258",
    "Events": "5"
  },
  {
    "Name": "Newton",
    "Nachricht": "",
    "Clicks": "467",
    "Events": "5"
  }, {
    "Name": "Newton",
    "Nachricht": "Exphy :(",
    "Clicks": "47",
    "Events": "1"
  }, {
    "Name": "Weierstrass",
    "Nachricht": "Mathe...",
    "Clicks": "100",
    "Events": "14"
  }, {
    "Name": "Heisenberg",
    "Nachricht": "Alles so unscharf",
    "Clicks": "20",
    "Events": "0"
  }, {
    "Name": "Marie Curie",
    "Nachricht": "Hab mich wieder übergeben...",
    "Clicks": "197",
    "Events": "0"
  }];

window.addEventListener('load', () => {
  loadJson((error, result) => {
    if (error)
      console.log(error);
    CreateUserTableFromJSON(result, 'showData');
  }, '/api/list');

  CreateTableFromJSON(testTable, 'showData2');

  loadJson((error, result) => {
    if (error)
      console.log(error);
    CreateTextFromJSON(result, 'versionData');
  }, '/version.json');

  loadJson((error, result) => {
    if (error)
      console.log(error);
    CreateTextFromJSON(result, 'apiv');
  }, '/api');
});
