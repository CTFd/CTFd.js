export function getReadNotifications(){
  let readNotifs = localStorage.getItem("CTFd:read_notifications") || "[]"
  readNotifs = JSON.parse(readNotifs);
  return readNotifs;
}
export function setReadNotifications(notifications){
  localStorage.setItem("CTFd:read_notifications", JSON.stringify(notifications));
}
export function insertReadNotification(notificationId){
  let readNotifs = getReadNotifications();
  readNotifs.push(notificationId)
  localStorage.setItem("CTFd:read_notifications", JSON.stringify(readNotifs));
  return readNotifs;
}
export function getLastReadNotification() {
  let readNotifs = getReadNotifications();
  return Math.max(...readNotifs);
}


export function getUnreadNotifications(){
  let unreadNotifs = localStorage.getItem("CTFd:unread_notifications") || "[]"
  unreadNotifs = JSON.parse(unreadNotifs);
  return unreadNotifs;
}
export function setUnreadNotifications(notifications){
  localStorage.setItem("CTFd:unread_notifications", JSON.stringify(notifications));
}
export function insertUnreadNotification(notificationId) {
  let unreadNotifs = getUnreadNotifications();
  unreadNotifs.push(notificationId)
  localStorage.setItem("CTFd:unread_notifications", JSON.stringify(unreadNotifs));
  return unreadNotifs;
}
export function markUnreadNotifications() {
  let unread = getUnreadNotifications();
  let read = getReadNotifications();
  setReadNotifications(read.concat(unread));
  setUnreadNotifications([]);
}


// export async function getUnreadCount() {
//   let since = getLastReadNotification();
//   let url = since ? `/api/v1/notifications?since_id=${since}` : "/api/v1/notifications";
//   const response = await CTFd.fetch(url, {
//     method: "HEAD"
//   });
//   return response.headers["result-count"];
// }