import CTFd from "../main";

export async function userSolves(userId) {
  const response = await CTFd.fetch(`/api/v1/users/${userId}/solves`, {
    method: "GET"
  });
  const body = await response.json();
  return body;
}

export async function userFails(userId) {
  const response = await CTFd.fetch(`/api/v1/users/${userId}/fails`, {
    method: "GET"
  });
  const body = await response.json();
  return body;
}

export async function userAwards(userId) {
  const response = await CTFd.fetch(`/api/v1/users/${userId}/awards`, {
    method: "GET"
  });
  const body = await response.json();
  return body;
}
