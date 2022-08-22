const getStorage = (key, fallback = []) => {
  return JSON.parse(localStorage.getItem(`CTFd:${key}`)) || fallback;
};

const setStorage = (key, value) => {
  localStorage.setItem(`CTFd:${key}`, JSON.stringify(value));
};

export function getReadNotifications() {
  return getStorage("read_notifications");
}

export function getUnreadNotifications() {
  return getStorage("unread_notifications");
}

export function setReadNotifications(notifications) {
  setStorage("read_notifications", notifications);
}

export function setUnreadNotifications(notifications) {
  setStorage("unread_notifications", notifications);
}

export function insertReadNotification(notificationId) {
  const read = [...getReadNotifications(), notificationId];
  setReadNotifications(read);
  removeUnreadNotification(notificationId);
  return read;
}

export function insertUnreadNotification(notificationId) {
  const unread = [...getUnreadNotifications(), notificationId];
  setUnreadNotifications(unread);
  return unread;
}

export function getLastReadNotification() {
  const read = getReadNotifications();

  if (read.length === 0) {
    return 0;
  }

  return Math.max(...read);
}

export function removeUnreadNotification(notificationId) {
  const unread = getUnreadNotifications();
  const notifications = unread.filter(n => n !== notificationId);
  setUnreadNotifications(notifications);
}

export function markUnreadNotifications() {
  const unread = getUnreadNotifications();
  const read = getReadNotifications();
  setReadNotifications(read.concat(unread));
  setUnreadNotifications([]);
}
