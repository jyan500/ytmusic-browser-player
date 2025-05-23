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

// store the id so that when the window closes, we can stop the background audio
let extensionWindowId = null
chrome.action.onClicked.addListener((tab) => {
    chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: 'popup',
        width: 700,
        height: 800,
    }, (newWindow) => {
        extensionWindowId = newWindow.id
    });
});

// ensure that the ensureOffscreenDocument() only is called one time
let isCreatingOffscreen = false
async function ensureOffscreenDocument() {
    if (isCreatingOffscreen) return
    isCreatingOffscreen = true

    const exists = await chrome.offscreen.hasDocument()
    if (!exists) {
        await chrome.offscreen.createDocument({
            url: 'offscreen.html',
            reasons: ['AUDIO_PLAYBACK'],
            justification: 'Keep audio playing while extension UI is closed or minimized'
        })
    }
    isCreatingOffscreen = false
}

/* 
    In order to ensure the offscreen document's existence, any messages from the main popup 
    must be sent through the background service to the offscreen document 
*/
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.ensureOffscreenExists && message.type === "AUDIO_COMMAND") {
        await ensureOffscreenDocument()
        // Now forward the audio command to the offscreen page after we've confirmed
        // the offscreen document exists
        chrome.runtime.sendMessage({
            type: message.type + "_CONFIRMED",
            payload: message.payload,
        })

    }
    console.warn('Unhandled message type:', message.type)
    sendResponse({ success: true })
    return true
})

chrome.windows.onRemoved.addListener(async (closedWindowId) => {
    if (closedWindowId === extensionWindowId) {
        // Stop audio by messaging the offscreen document
        chrome.runtime.sendMessage({
            type: 'AUDIO_COMMAND_CONFIRMED',
            payload: {
                action: 'stop'
            }
        })

        // close offscreen document
        const hasDoc = await chrome.offscreen.hasDocument()
        if (hasDoc) {
            await chrome.offscreen.closeDocument()
        }

        extensionWindowId = null
    }
})