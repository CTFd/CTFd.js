import fetch from "./fetch";
import config from "./config";
import { colorHash, copyToClipboard, hashCode, renderTimes } from "./ui";
import { getChallenges, getChallenge, displayChallenges } from "./pages/challenges";
import {
  displayChallenge,
  submitChallenge,
  loadSolves,
  displaySolves,
  loadHint,
  loadUnlock,
  displayUnlock,
  displayHint,
} from "./pages/challenge";
import { getScoreboard, getScoreboardDetail } from "./pages/scoreboard";
import { updateSettings, generateToken, deleteToken } from "./pages/settings";
import { userSolves, userFails, userAwards } from "./pages/users";
import {
  getInviteToken,
  disbandTeam,
  updateTeamSettings,
  teamSolves,
  teamFails,
  teamAwards,
} from "./pages/teams";
import { getScript } from "./utils/ajax";
import { createHtmlNode, htmlEntities } from "./utils/html";

import events from "./events/main";

import $ from "cash-dom";

import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);

const user = {
  id: null,
  name: null,
  email: null,
};
const team = {
  id: null,
  name: null,
};
const _internal = {};

const _functions = {
  challenge: {
    // Displaying challenge and render challenge
    displayChallenge: null,
    renderChallenge: null,

    // Displaying hints and unlocks
    displayHint(hint) {
      alert(hint.content);
    },

    displayUnlock(hint) {
      return confirm("Are you sure you'd like to unlock this hint?");
    },

    displayUnlockError(unlock) {
      const msg = [];

      Object.keys(unlock.errors).map(error => {
        msg.push(unlock.errors[error]);
      });

      const errorMsg = msg.join("\n");
      alert(errorMsg);
    },

    // Submit challenge and display response data
    submitChallenge: null,
    displaySubmissionResponse: null,

    // Display solves for challenge
    displaySolves: null,
  },

  challenges: {
    // Display challenges on page
    displayChallenges: null,

    // How to sort challenges before display
    sortChallenges: null,
  },

  events: {
    eventAlert: null,
    eventToast: null,
    eventBackground: null,
    eventRead: null,
    eventCount: null,
  },
};

const ui = {
  htmlEntities,
  colorHash,
  copyToClipboard,
  hashCode,
  renderTimes,
};

const utils = {
  ajax: {
    getScript,
  },
  html: {
    createHtmlNode,
    htmlEntities,
  },
};

const pages = {
  challenge: {
    displayChallenge,
    submitChallenge,
    loadSolves,
    displaySolves,
    loadHint,
    loadUnlock,
    displayUnlock,
    displayHint,
  },
  challenges: {
    getChallenges,
    getChallenge,
    displayChallenges,
  },
  scoreboard: {
    getScoreboard,
    getScoreboardDetail,
  },
  settings: {
    updateSettings,
    generateToken,
    deleteToken,
  },
  users: {
    userSolves,
    userFails,
    userAwards,
  },
  teams: {
    getInviteToken,
    disbandTeam,
    updateTeamSettings,
    teamSolves,
    teamFails,
    teamAwards,
  },
};

const lib = {
  $,
  dayjs,
};

let initialized = false;
const init = data => {
  if (initialized) {
    return;
  }
  initialized = true;

  config.urlRoot = data.urlRoot || config.urlRoot;
  config.csrfNonce = data.csrfNonce || config.csrfNonce;
  config.userMode = data.userMode || config.userMode;
  config.start = data.start || config.start;
  config.end = data.end || config.end;
  config.themeSettings = data.themeSettings || config.themeSettings;
  config.eventSounds = data.eventSounds || config.eventSounds;
  config.preview = false;
  user.id = data.userId;
  user.name = data.userName || user.name;
  user.email = data.userEmail || user.email;
  team.id = data.teamId;
  team.name = data.teamName || team.name;

  events.init(config.urlRoot, config.eventSounds);
};

const plugin = {
  run(f) {
    f(CTFd);
  },
};

const CTFd = {
  init,
  config,
  fetch,
  user,
  team,
  ui,
  utils,
  pages,
  events,
  _internal,
  _functions,
  plugin,
  lib,
};

window.CTFd = CTFd;
export default CTFd;
