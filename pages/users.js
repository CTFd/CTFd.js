import CTFd from "../main";

export async function getUsers(page = 1, query = {}) {
  const response = await CTFd.fetch(
    "/api/v1/users",
    { method: "GET" },
    { page, ...query }
  );
  const body = await response.json();
  let users = body["data"];

  return users;
}

export async function userSolves(userId) {
  const response = await CTFd.fetch(`/api/v1/users/${userId}/solves`, {
    method: "GET",
  });

  return await response.json(); // body
}

export async function userFails(userId) {
  const response = await CTFd.fetch(`/api/v1/users/${userId}/fails`, {
    method: "GET",
  });

  return await response.json(); // body
}

export async function userAwards(userId) {
  const response = await CTFd.fetch(`/api/v1/users/${userId}/awards`, {
    method: "GET",
  });

  return await response.json(); // body
}
