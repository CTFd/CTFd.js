import "whatwg-fetch";
import config from "./config";

const fetch = window.fetch;

function rfill(str) {
  return str.replace(/\/$/, "") + "/";
}

function ltrim(str) {
  return str.replace(/^\//, "");
}

export default (url, options, query = {}) => {
  if (options === undefined) {
    options = {
      method: "GET",
      credentials: "same-origin",
      headers: {},
    };
  }

  url = new URL(ltrim(url), rfill(config.urlRoot));
  if (query.length > 0) url.search = new URLSearchParams(query);

  if (options.headers === undefined) {
    options.headers = {};
  }
  options.credentials = "same-origin";
  options.headers["Accept"] = "application/json";
  options.headers["Content-Type"] = "application/json";
  options.headers["CSRF-Token"] = config.csrfNonce;

  return fetch(url, options);
};
