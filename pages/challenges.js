import CTFd from "../main";
import { hashCode } from "../ui";
import { displayChallenge } from "./challenge";

export async function getChallenges() {
  const response = await CTFd.fetch("/api/v1/challenges", {
    method: "GET"
  });
  const body = await response.json();
  let challenges = body["data"];

  // Call user func
  if (CTFd._functions.challenges.sortChallenges) {
    challenges = CTFd._functions.sortChallenges(challenges);
  }

  return challenges;
}

export async function getChallenge(challengeId) {
  const response = await CTFd.fetch(`/api/v1/challenges/${challengeId}`, {
    method: "GET"
  });
  const body = await response.json();
  return body["data"];
}

export async function displayChallenges() {
  let challenges = await getChallenges();

  // Call user func
  if (CTFd._functions.challenges.displayChallenges) {
    CTFd._functions.challenges.displayChallenges(challenges);
    return;
  }
}
