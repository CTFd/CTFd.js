export function createHtmlNode(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

export function htmlEntities(string) {
  const div = document.createElement("div");
  div.innerText = string;
  return div.innerHTML;
}
