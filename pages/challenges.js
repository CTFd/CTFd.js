import CTFd from "../main";

export async function getChallenges(query = {}) {
  let url = "/api/v1/challenges";
  let qs = new URLSearchParams(query).toString();
  if (qs) {
    url = `${url}?${qs}`;
  }
  const response = await CTFd.fetch(url, { method: "GET" });
  const body = await response.json();
  let challenges = body["data"];

  // Call user func
  if (CTFd._functions.challenges.sortChallenges) {
    challenges = CTFd._functions.challenges.sortChallenges(challenges);
  }

  return challenges;
}

export async function getChallenge(challengeId) {
  const response = await CTFd.fetch(`/api/v1/challenges/${challengeId}`, {
    method: "GET",
  });
  const body = await response.json();
  return body["data"];
}

export async function displayChallenges() {
  let challenges = await getChallenges();

  // Call user func
  if (CTFd._functions.challenges.displayChallenges) {
    CTFd._functions.challenges.displayChallenges(challenges);
  }
}
