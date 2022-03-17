import { NativeEventSource, EventSourcePolyfill } from "event-source-polyfill";
import { WindowController } from "./controller";
import { Howl } from "howler";
import CTFd from "../main";

const EventSource = NativeEventSource || EventSourcePolyfill;

export default root => {
  const source = new EventSource(root + "/events");
  const wc = new WindowController();
  const howl = new Howl({
    src: [
      root + "/themes/core/static/sounds/notification.webm",
      root + "/themes/core/static/sounds/notification.mp3"
    ]
  });

  function connect() {
    source.addEventListener(
      "notification",
      function(event) {
        let data = JSON.parse(event.data);
        wc.broadcast("notification", data);

        // Render in the master tab
        render(data);

        // Only play sounds in the master tab
        if (data.sound) {
          howl.play();
        }
      },
      false
    );
  }

  function disconnect() {
    if (source) {
      source.close();
    }
  }

  function render(data) {
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
  }

  wc.alert = function(data) {
    render(data);
  };

  wc.toast = function(data) {
    render(data);
  };

  wc.background = function(data) {
    render(data);
  };

  wc.masterDidChange = function() {
    if (this.isMaster) {
      connect();
    } else {
      disconnect();
    }
  };
};
