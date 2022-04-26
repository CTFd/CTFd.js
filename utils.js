export function getScript(src) {
  const p = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    document.body.appendChild(script);
    script.onload = resolve;
    script.onerror = reject;
    script.async = true;
    script.src = src;
  });

  return p;
}

export function createHtmlNode(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

export function htmlEntities(string) {
  const div = document.createElement('div');
  div.innerText = string;
  return div.innerHTML;
}
