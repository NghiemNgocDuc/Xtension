// background.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.action === "open_recorder") {
    // open recorder window (small)
    const url = chrome.runtime.getURL("recorder.html");
    // open in a new popup window so user can grant mic access
    chrome.windows.create({
      url,
      type: "popup",
      width: 420,
      height: 240
    });
  }
  
  // Handle tab operations
  if (msg && msg.action === "open_new_tab") {
    chrome.tabs.create({ url: msg.url || "chrome://newtab" }, (tab) => {
      sendResponse({ success: true, tabId: tab.id });
    });
    return true; // Keep message channel open for async response
  }
  
  if (msg && msg.action === "close_tab") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        chrome.tabs.remove(tabs[0].id, () => {
          sendResponse({ success: true });
        });
      } else {
        sendResponse({ success: false, error: "No active tab found" });
      }
    });
    return true; // Keep message channel open for async response
  }
  
  if (msg && msg.action === "close_other_tabs") {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      const currentTab = tabs.find(t => t.active);
      const otherTabIds = tabs.filter(t => !t.active).map(t => t.id);
      if (otherTabIds.length > 0) {
        chrome.tabs.remove(otherTabIds, () => {
          sendResponse({ success: true, closed: otherTabIds.length });
        });
      } else {
        sendResponse({ success: true, closed: 0 });
      }
    });
    return true;
  }
  
  if (msg && msg.action === "duplicate_tab") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        chrome.tabs.duplicate(tabs[0].id, (newTab) => {
          sendResponse({ success: true, tabId: newTab.id });
        });
      } else {
        sendResponse({ success: false, error: "No active tab found" });
      }
    });
    return true;
  }
});
