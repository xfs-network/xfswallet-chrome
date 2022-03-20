var port = chrome.runtime.connect();
window.addEventListener("message", (event) => {
  if (event.source != window) {
    return;
  }
  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    port.postMessage(event.data.text);
  }
}, false);
port.onMessage.addListener((msg)=>{
  window.postMessage({type: "FROM_XFSWALLET", text: msg}, "*");
});
function injectScript(file_path, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
}
injectScript(chrome.runtime.getURL('contentscript.js'), 'body');