import CTFd from "../main";
import { getScript } from "../utils/ajax";
import { getChallenge } from "./challenges";

// Challenge UI
export async function displayChallenge(challengeId, renderChallenge) {
  // Clear out previous challenge data
  CTFd._internal.challenge = {};

  let config = CTFd.config;
  let challenge = await getChallenge(challengeId);

  // Call user func
  if (CTFd._functions.challenge.displayChallenge) {
    CTFd._functions.challenge.displayChallenge(challenge);
  }

  let p = getScript(config.urlRoot + challenge.type_data.scripts.view);
  p.then(() => {
    const internal = CTFd._internal.challenge;
    internal.data = challenge;

    internal.preRender();

    // Call user func
    if (CTFd._functions.challenge.renderChallenge) {
      CTFd._functions.challenge.renderChallenge(internal);
    } else if (renderChallenge) {
      renderChallenge(internal);
    }

    internal.postRender();
  });
}

export async function submitChallenge(challengeId, challengeValue, preview = false) {
  // Call user func
  if (CTFd._functions.challenge.submitChallenge) {
    CTFd._functions.challenge.submitChallenge(challengeId, challengeValue);
    return;
  }

  let url = `/api/v1/challenges/attempt`;
  if (preview === true || CTFd.config.preview === true) {
    url += "?preview=true";
  }

  const response = await CTFd.fetch(url, {
    method: "POST",
    body: JSON.stringify({
      challenge_id: challengeId,
      submission: challengeValue,
    }),
  });
  const result = await response.json();

  if (CTFd._functions.challenge.displaySubmissionResponse) {
    CTFd._functions.challenge.displaySubmissionResponse(result);
  }

  return result;
}

// Hints
export async function loadHint(hintId) {
  const response = await CTFd.fetch(`/api/v1/hints/${hintId}`, {
    method: "GET",
  });

  return await response.json(); // hint
}

export async function loadUnlock(targetId, targetType = "hints") {
  const response = await CTFd.fetch(`/api/v1/unlocks`, {
    method: "POST",
    body: JSON.stringify({ target: targetId, type: targetType }),
  });

  return await response.json(); // unlock
}

export async function displayHint(hintId) {
  let response = await loadHint(hintId);
  let hint = response.data;
  if (hint.content) {
    CTFd._functions.challenge.displayHint(hint);
    return;
  }

  let res = await displayHintUnlock(hint);
  if (res) {
    let unlock = await loadUnlock(hintId);

    // Display hint or error depending on unlock
    if (unlock.success) {
      await displayHint(hintId);
    } else {
      CTFd._functions.challenge.displayUnlockError(unlock);
    }
  }
}

/**
 * @deprecated since 0.0.16 - use `displayHintUnlock()` instead.
 */
export async function displayUnlock(hint) {
  // Deprecated use `displayHintUnlock()` or `displaySolutionUnlock()` instead
  return CTFd._functions.challenge.displayUnlock(hint);
}

export async function displayHintUnlock(hint) {
  return CTFd._functions.challenge.displayHintUnlock(hint);
}

export async function displaySolutionUnlock(solution) {
  return CTFd._functions.challenge.displaySolutionUnlock(solution);
}

// Solves
export async function loadSolves(challengeId) {
  const response = await CTFd.fetch(`/api/v1/challenges/${challengeId}/solves`, {
    method: "GET",
  });
  const body = await response.json();
  return body["data"];
}

export async function displaySolves(challengeId) {
  let solves = await loadSolves(challengeId);

  if (CTFd._functions.challenge.displaySolves) {
    CTFd._functions.challenge.displaySolves(solves);
  }
}

export async function loadSolution(solutionId) {
  const response = await CTFd.fetch(`/api/v1/solutions/${solutionId}`, {
    method: "GET",
  });

  const body = await response.json();
  return body["data"];
}

export async function displaySolution(solutionId) {
  let solution = await loadSolution(solutionId);
  if (solution.content) {
    if (CTFd._functions.challenge.displaySolution) {
      CTFd._functions.challenge.displaySolution(solution);
      return;
    }
  }

  let res = await displaySolutionUnlock(solution);
  if (res) {
    let unlock = await loadUnlock(solution.id, "solutions");

    // Display hint or error depending on unlock
    if (unlock.success) {
      await displaySolution(solutionId);
    } else {
      CTFd._functions.challenge.displayUnlockError(unlock);
    }
  }
}

export async function submitRating(challengeId, rating) {
  const response = await CTFd.fetch(`/api/v1/challenges/${challengeId}/ratings`, {
    method: "PUT",
    body: JSON.stringify({ value: rating }),
  });

  const body = await response.json();
  return body["data"];
}
