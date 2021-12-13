var port = chrome.runtime.connect();
window.addEventListener("message", (event) => {
  // We only accept messages from ourselves
  if (event.source != window) {
    return;
  }
  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    port.postMessage(event.data.text);
  }
}, false);

function injectScript(file_path, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
}
injectScript(chrome.runtime.getURL('contentscript.js'), 'body');