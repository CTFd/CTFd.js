import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import $ from "cash-dom";

dayjs.extend(advancedFormat);

export function renderTimes() {
  let times = document.querySelectorAll("[data-time]");
  for (const timeElem of times) {
    let timeData = timeElem.dataset.time;
    let timeFormat = timeElem.dataset.timeFormat;
    timeElem.innerText = dayjs(timeData).format(timeFormat);
  }
}

export function copyToClipboard(event, selector) {
  // Select element
  $(selector).select();

  // Copy to clipboard
  document.execCommand("copy");

  // Show tooltip to user
  $(event.target).tooltip({
    title: "Copied!",
    trigger: "manual",
  });
  $(event.target).tooltip("show");

  setTimeout(function () {
    $(event.target).tooltip("hide");
  }, 1500);
}

export function htmlEntities(string) {
  return $("<div/>").text(string).html();
}

export function hashCode(s) {
  let hash = 0, i, chr, len;

  if (s.length === 0)
    return hash;

  for (i = 0, len = s.length; i < len; i++) {
    chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }

  return hash;
}

// https://gist.github.com/0x263b/2bdd90886c2036a1ad5bcf06d6e6fb37
export function colorHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  // Range calculation
  // diff = max - min;
  // x = ((hash % diff) + diff) % diff;
  // return x + min;
  // Calculate HSL values
  // Range from 0 to 360
  let h = ((hash % 360) + 360) % 360;
  // Range from 75 to 100
  let s = (((hash % 25) + 25) % 25) + 75;
  // Range from 40 to 60
  let l = (((hash % 20) + 20) % 20) + 40;
  return `hsl(${h}, ${s}%, ${l}%)`;
}
