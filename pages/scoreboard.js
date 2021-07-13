import CTFd from "../main";

export async function getScoreboard() {
  const response = await CTFd.fetch("/api/v1/scoreboard", {
    method: "GET"
  });
  const body = await response.json();
  let scoreboard = body["data"];
  return scoreboard;
}

export async function getScoreboardDetail(count) {
  const response = await CTFd.fetch(`/api/v1/scoreboard/top/${count}`, {
    method: "GET"
  });
  const body = await response.json();
  let scoreboard = body["data"];
  return scoreboard;
}
