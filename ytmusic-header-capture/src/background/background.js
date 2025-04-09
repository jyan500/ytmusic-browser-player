chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        const headers = details.requestHeaders || [];
        console.log("headers: ", headers)
        chrome.storage.local.set({ ytMusicHeaders: headers });
    },
    { urls: ["https://music.youtube.com/*"] },
    ["requestHeaders", "extraHeaders"]
);
// chrome.runtime.onInstalled.addListener(() => {
//     console.log("I just Installed My Chrome Extension");
// });

