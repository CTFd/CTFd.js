import CTFd from "../main";

export async function getScoreboard(bracketId = null) {
  let url = "/api/v1/scoreboard";
  if (bracketId) {
    url = `${url}&bracket_id=${bracketId}`;
  }
  const response = await CTFd.fetch(url, {
    method: "GET",
  });
  const body = await response.json();
  return body["data"]; // scoreboard data
}

export async function getScoreboardDetail(count, bracketId = null) {
  let url = `/api/v1/scoreboard/top/${count}`;
  if (bracketId) {
    url = `${url}&bracket_id=${bracketId}`;
  }
  const response = await CTFd.fetch(url, {
    method: "GET",
  });
  const body = await response.json();
  return body["data"]; // scoreboard data
}

export async function getBrackets(userMode) {
  const response = await CTFd.fetch(`/api/v1/brackets?type=${userMode}`, {
    method: "GET",
  });
  const body = await response.json();
  return body["data"];
}
