chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        const headers = details.requestHeaders || [];
        chrome.storage.local.set({ ytMusicHeaders: relevant });
    },
    { urls: ["https://music.youtube.com/*"] },
    ["requestHeaders", "extraHeaders"]
);
// chrome.runtime.onInstalled.addListener(() => {
//     console.log("I just Installed My Chrome Extension");
// });

