import { WindowController } from "./controller";
import { Howl } from "howler";
import {
  getReadNotifications,
  setReadNotifications,
  insertReadNotification,
  getLastReadNotification,
  getUnreadNotifications,
  setUnreadNotifications,
  removeUnreadNotification,
  insertUnreadNotification,
  markUnreadNotifications,
} from "./counter";
import CTFd from "../main";

const events = {
  init: (root, eventSounds) => {
    events.source = new EventSource(root + "/events");
    for (let i = 0; i < eventSounds.length; i++) {
      eventSounds[i] = `${root}${eventSounds[i]}`;
    }
    events.howl = new Howl({
      src: eventSounds,
    });

    let lastId = getLastReadNotification();
    CTFd.fetch(`/api/v1/notifications?since_id=${lastId}`, {
      method: "HEAD",
    }).then(response => {
      let unread = response.headers.get("result-count");
      if (unread) {
        // Sync count between tabs
        events.controller.broadcast("counter", { count: unread });
        CTFd._functions.events.eventCount(unread);
      }
    });
  },
  controller: new WindowController(),
  source: null,
  howl: null,
  connect: () => {
    events.source.addEventListener(
      "notification",
      function (event) {
        let data = JSON.parse(event.data);
        events.controller.broadcast("notification", data);

        CTFd.events.counter.unread.add(data.id);

        // Update notification count
        let count = CTFd.events.counter.unread.getAll().length;
        events.controller.broadcast("counter", { count: count });
        CTFd._functions.events.eventCount(count);

        // Render in the master tab
        events.render(data);

        // Only play sounds in the master tab
        if (data.sound) {
          events.howl.play();
        }
      },
      false
    );
  },
  disconnect: () => {
    if (events.source) {
      events.source.close();
    }
  },
  render: data => {
    switch (data.type) {
      case "toast": {
        CTFd._functions.events.eventToast(data);
        break;
      }
      case "alert": {
        CTFd._functions.events.eventAlert(data);
        break;
      }
      case "background": {
        CTFd._functions.events.eventBackground(data);
        break;
      }
      default: {
        console.log(data);
        alert(data);
        break;
      }
    }
  },
  counter: {
    read: {
      getAll: getReadNotifications,
      setAll: setReadNotifications,
      add: insertReadNotification,
      getLast: getLastReadNotification,
    },
    unread: {
      getAll: getUnreadNotifications,
      setAll: setUnreadNotifications,
      add: insertUnreadNotification,
      remove: removeUnreadNotification,
      readAll: markUnreadNotifications,
    },
  },
};

events.controller.alert = function (data) {
  events.render(data);
};

events.controller.toast = function (data) {
  events.render(data);
};

events.controller.background = function (data) {
  events.render(data);
};

events.controller.counter = function (data) {
  CTFd._functions.events.eventCount(data.count);
};

events.controller.masterDidChange = function () {
  if (this.isMaster) {
    events.connect();
  } else {
    events.disconnect();
  }
};

export default events;
