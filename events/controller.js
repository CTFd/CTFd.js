// https://gist.github.com/neilj/4146038
// https://fastmail.blog/2012/11/26/inter-tab-communication-using-local-storage/

export class WindowController {
  constructor() {
    this.id = Math.random();
    this.isMaster = false;
    this.others = {};

    window.addEventListener("storage", this);
    window.addEventListener("unload", this);

    this.broadcast("hello");

    // schedule initial check
    setTimeout(this.check.bind(this), 500);

    this._checkInterval = setInterval(this.check.bind(this), 9000);
    this._pingInterval = setInterval(this.sendPing.bind(this), 17000);
  }

  destroy() {
    clearInterval(this._pingInterval);
    clearInterval(this._checkInterval);

    window.removeEventListener("storage", this);
    window.removeEventListener("unload", this);

    this.broadcast("bye");
  }

  handleEvent(event) {
    if (event.type === "unload") {
      this.destroy();
      return;
    }

    if (event.type === "broadcast") {
      try {
        const data = JSON.parse(event.newValue);

        if (data.id !== this.id) {
          this[data.type](data);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  sendPing() {
    this.broadcast("ping");
  }

  hello(event) {
    this.ping(event);

    if (event.id < this.id) {
      this.check();
      return;
    }

    this.sendPing();
  }

  ping(event) {
    this.others[event.id] = Date.now();
  }

  bye(event) {
    delete this.others[event.id];
    this.check();
  }

  check() {
    const now = Date.now();
    let takeMaster = true;

    for (const id in this.others) {
      if (this.others[id] + 23000 < now) {
        delete this.others[id];
      } else if (id < this.id) {
        takeMaster = false;
      }
    }

    if (this.isMaster !== takeMaster) {
      this.isMaster = takeMaster;
      this.masterDidChange();
    }
  }

  masterDidChange() {}

  broadcast(type, data) {
    const event = {
      id: this.id,
      type,
      ...data,
    };

    try {
      localStorage.setItem("broadcast", JSON.stringify(event));
    } catch (error) {
      console.error(error);
    }
  }
}
