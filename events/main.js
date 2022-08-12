import { NativeEventSource, EventSourcePolyfill } from "event-source-polyfill";
import { WindowController } from "./controller";
import { Howl } from "howler";
import { getUnreadNotifications, insertUnreadNotification } from "./counter";
import CTFd from "../main";

const EventSource = NativeEventSource || EventSourcePolyfill;

const events = {
  init: (root) => {
    events.source = new EventSource(root + "/events");
    events.howl = new Howl({
      src: [
        root + "/themes/core/static/sounds/notification.webm",
        root + "/themes/core/static/sounds/notification.mp3",
      ],
    });
    events.updateCount();
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

        insertUnreadNotification(data.id);
        events.controller.broadcast("counter");

        // Update notification count
        events.updateCount();

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
  render: (data) => {
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
  updateCount: () => {
    document.querySelector("#unread-count").textContent =
      getUnreadNotifications().length;
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
  events.updateCount();
};

events.controller.masterDidChange = function () {
  if (this.isMaster) {
    events.connect();
  } else {
    events.disconnect();
  }
};

export default events;
