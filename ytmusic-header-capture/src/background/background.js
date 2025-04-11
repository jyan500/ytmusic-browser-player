import axios from "axios"

chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        const headerNames = ["authorization", "user-agent", "accept", "accept-language", "content-type", "x-goog-authuser", "x-origin", "cookie"]
        const headers = details.requestHeaders || [];
        const relevant = headers.reduce((acc, header) => {
            if (headerNames.includes(header.name.toLowerCase())){
                acc[header.name] = header.value 
            }
            return acc
        }, {})
        chrome.storage.local.set({ ytMusicHeaders: relevant });
    },
    { urls: ["https://music.youtube.com/youtubei/v1/browse*"] },
    ["requestHeaders", "extraHeaders"]
);
