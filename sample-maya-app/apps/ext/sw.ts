chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    console.log(`sending message tot tabs`);
    console.log(new Date());
    chrome.tabs.sendMessage(tabId, { videoLoaded: true });
  }
});
