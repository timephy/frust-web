window.addEventListener("load", () => {
  loadJson((error, result) => {
    if (error) console.log(error);

    result = result.filter((el) => el.name != null);

    // CreateUserTableFromJSON(result, "showOnlineUsers", "Nutzer (online)");
    createTable(result, "showOnlineUsers", `online Nutzer (${result.length})`, {
      "Name": "name",
      "Klicks (Session)": "click_count_session",
      "Events (Session)": "event_count_session"
    });
  }, "/api/online_users");

  loadJson((error, result) => {
    if (error) console.log(error);

    console.log(result);
    result = result.sort((a, b) => b.click_count - a.click_count);

    // CreateTableFromJSON(result, "showUsers", "Nutzer (alle)");
    createTable(result, "showUsers", `alle Nutzer (${result.length})`, {
      "Name": "name",
      "Klicks": "click_count",
      "Events": "event_count"
    });
  }, "/api/users");

  loadJson((error, result) => {
    if (error) console.log(error);

    console.log("raw result ", result);
    result = groupBy(result, event => event.name);
    console.log("grouped result ", result);
    result = Object.entries(result).map((key) => {
      // console.log(key);
      const events = key[1];
      const firstEvent = events[0];
      return {
        count: events.length,
        event: firstEvent.name
      };
    });
    console.log("final result ", result);
    var values = [];
    var names = [];
    values = result.map(x => x.count);
    names = result.map(x => x.event);

    makeChart({
      names: names,
      values: values
    }, "eventChart", "Events (heute)");
  }, "/api/latest_events");

  loadJson((error, result) => {
    if (error) console.log(error);

    // only show last 2 days of hours
    result = result.slice(-24 * 2);

    function labelForTimestamp(timestamp) {
      const date = new Date(timestamp * 1000);
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay
      const daysOfWeek = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

      return daysOfWeek[date.getDay()] + " " + date.getHours() + ":00";
    }

    // Date takes time in ms not s, get local time
    const timestamps = result.map(x => labelForTimestamp(x.timestamp));
    //const timestamps = result.map(x => new Date(x.timestamp * 1000).getHours() + ":00")
    const clicks = result.map(x => x.click_count);
    const events = result.map(x => x.event_count);
    makeLineChart({
      timestamps: timestamps,
      events: events,
      clicks: clicks
    }, "hourChart", "Clicks (heute)");
  }, "/api/latest_hours");

  loadJson((error, result) => {
    if (error) console.log(error);
    CreateTextFromJSON(result, "versionData", "Frontend version:");
  }, "/version.json");

  loadJson((error, result) => {
    if (error) console.log(error);
    CreateTextFromJSON(result, "api-version", "Backend version:");
  }, "/api");

  loadJson((error, result) => {
    if (error) console.log(error);

    console.log("raw result ", result);
    result = groupBy(result, event => event.user + "\n" + event.name);
    console.log("grouped result ", result);
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

    // CreateTableFromJSON(result, "latest-events", "Events (heute)");
    createTable(result, "latest-events", `heutige Events (${result.length})`, {
      "Nutzer": "user",
      "Anzahl": "count",
      "Event": "event"
    });
  }, "/api/latest_events");

  loadJson((error, result) => {
    if (error) console.log(error);

    result = groupBy(result, click => click.user + "\n" + click.comment);
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

    // CreateTableFromJSON(result, "latest-clicks", "Klicks (heute)");
    createTable(result, "latest-clicks", "Klicks (heute)", {
      "Nutzer": "user",
      "Anzahl": "count",
      "Kommentar": "comment"
    });
  }, "/api/latest_clicks");
});
