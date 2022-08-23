import CTFd from "../main";

export async function getInviteToken() {
  const response = await CTFd.fetch("/api/v1/teams/me/members", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return await response.json(); // token
}

export async function disbandTeam() {
  const response = await CTFd.fetch("/api/v1/teams/me", {
    method: "DELETE",
  });

  return await response.json(); // body
}

export async function updateTeamSettings(body) {
  const response = await CTFd.fetch("/api/v1/teams/me", {
    method: "PATCH",
    body: JSON.stringify(body),
  });

  return await response.json(); // settings
}

// Statistics
export async function teamSolves(teamId) {
  const response = await CTFd.fetch(`/api/v1/teams/${teamId}/solves`, {
    method: "GET",
  });

  return await response.json(); // body
}

export async function teamFails(teamId) {
  const response = await CTFd.fetch(`/api/v1/teams/${teamId}/fails`, {
    method: "GET",
  });

  return await response.json(); // body
}

export async function teamAwards(teamId) {
  const response = await CTFd.fetch(`/api/v1/teams/${teamId}/awards`, {
    method: "GET",
  });

  return await response.json(); // body
}
