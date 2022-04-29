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
    } else {
      // pass
    }

    internal.postRender();
  });
}

export async function submitChallenge(challengeId, challengeValue) {
  // Call user func
  if (CTFd._functions.challenge.submitChallenge) {
    CTFd._functions.challenge.submitChallenge(challengeId, challengeValue);
    return;
  }

  const response = await CTFd.fetch(`/api/v1/challenges/attempt`, {
    method: "POST",
    body: JSON.stringify({
      challenge_id: challengeId,
      submission: challengeValue
    })
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
    method: "GET"
  });
  let hint = await response.json();
  return hint;
}

export async function loadUnlock(hintId) {
  const response = await CTFd.fetch(`/api/v1/unlocks`, {
    method: "POST",
    body: JSON.stringify({ target: hintId, type: "hints" })
  });
  const unlock = await response.json();
  return unlock;
}

export async function displayHint(hintId) {
  let response = await loadHint(hintId);
  let hint = response.data;
  if (hint.content) {
    CTFd._functions.challenge.displayHint(hint);
    return;
  } else {
    let res = await displayUnlock(hint);
    if (res) {
      let unlock = loadUnlock(hintId);

      // Display hint or error depending on unlock
      if (unlock.success) {
        displayHint(hintId);
      } else {
        CTFd._functions.challenge.displayUnlockError(unlock);
      }
    }
  }
}
export async function displayUnlock(hint) {
  return CTFd._functions.challenge.displayUnlock(hint);
}

// Solves
export async function loadSolves(challengeId) {
  const response = await CTFd.fetch(
    `/api/v1/challenges/${challengeId}/solves`,
    {
      method: "GET"
    }
  );
  const body = await response.json();
  return body["data"];
}

export async function displaySolves(challengeId) {
  let solves = await loadSolves(challengeId);
  if (CTFd._functions.challenge.displaySolves) {
    CTFd._functions.challenge.displaySolves(solves);
    return;
  }
}
