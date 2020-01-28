window.addEventListener('load', () => {
  loadJson((error, result) => {
    if (error)
      console.log(error);
    CreateUserTableFromJSON(result, 'showOnlineUsers');
  }, '/api/online_users');

  loadJson((error, result) => {
    if (error)
      console.log(error);
    CreateTableFromJSON(result, 'showUsers');
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

    CreateTableFromJSON(result, 'latest-clicks');
  }, '/api/latest_clicks');

    loadJson((error, result) => {
    if (error)
      console.log(error);

    console.log("raw result ",result)
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
    console.log("final result ",result)

    CreateTableFromJSON(result, 'latest-events');
  }, '/api/latest_events');

  loadJson((error, result) => {
    if (error)
      console.log(error);
    CreateTextFromJSON(result, 'versionData');
  }, '/version.json');

  loadJson((error, result) => {
    if (error)
      console.log(error);
    CreateTextFromJSON(result, 'api-version');
  }, '/api');
});
