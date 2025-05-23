import axios from "axios"

chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        const headerNames = ["x-goog-pageid", "authorization", "user-agent", "accept", "accept-language", "content-type", "x-goog-authuser", "x-origin", "cookie"]
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

chrome.action.onClicked.addListener((tab) => {
    chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: 'popup',
        width: 700,
        height: 800,
    });
});

async function ensureOffscreenDocument() {
    if (await chrome.offscreen.hasDocument()) return
    await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'Keep audio playing while UI is closed or minimized.'
    })
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === "ENSURE_OFFSCREEN_AND_PLAY") {
        await ensureOffscreenDocument()

        // Now forward the audio command to the offscreen page
        chrome.runtime.sendMessage({
            type: "AUDIO_COMMAND",
            payload: {
                action: "play",
                url: message.payload.url
            }
        })

        sendResponse({ success: true })
    }
})