import LibXFSWallet from './libxfswallt'
window.xfswallet = new LibXFSWallet();
window.addEventListener("message", (event) => {
    if (event.source != window) {
      return;
    }
    if (event.data.type && (event.data.type == "FROM_XFSWALLET")) {
        window.xfswallet.onMessage(event.data.text);
    }
});