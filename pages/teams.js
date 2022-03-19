import CTFd from "../main";

export async function getInviteToken() {
  const response = await CTFd.fetch("/api/v1/teams/me/members", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
  const token = await response.json();
  return token;
}

export async function disbandTeam() {
  const response = await CTFd.fetch("/api/v1/teams/me", {
    method: "DELETE"
  });
  const body = await response.json();
  return body;
}

export async function updateTeamSettings(body) {
  const response = await CTFd.fetch("/api/v1/teams/me", {
    method: "PATCH",
    body: JSON.stringify(body)
  });
  const settings = await response.json();
  return settings;
}

// Statistics
export async function teamSolves(teamId) {
  const response = await CTFd.fetch(`/api/v1/teams/${teamId}/solves`, {
    method: "GET"
  });
  const body = await response.json();
  let solves = body["data"];
  return solves;
}
export async function teamFails(teamId) {
  const response = await CTFd.fetch(`/api/v1/teams/${teamId}/fails`, {
    method: "GET"
  });
  const body = await response.json();
  let fails = body["data"];
  return fails;
}
export async function teamAwards(teamId) {
  const response = await CTFd.fetch(`/api/v1/teams/${teamId}/awards`, {
    method: "GET"
  });
  const body = await response.json();
  let awards = body["data"];
  return awards;
}
