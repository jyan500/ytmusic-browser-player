import axios from "axios"

const DEBUG = true

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
    // if we're already created the offscreen document, return true
    if (isCreatingOffscreen) {
        if (DEBUG){
            console.log("in the process of creating offscreen document...")
        }
        return true
    }
    isCreatingOffscreen = true

    const exists = await chrome.offscreen.hasDocument()
    if (!exists) {
        if (DEBUG){
            console.log("offscreen document no longer exists, creating...")
        }
        await chrome.offscreen.createDocument({
            url: 'offscreen.html',
            reasons: ['AUDIO_PLAYBACK'],
            justification: 'Keep audio playing while extension UI is closed or minimized'
        })
    }
    isCreatingOffscreen = false
    return true
}

// wait for the offscreen document to be ready before sending the next command
// by sending a "ping" to the offscreen. Should expect a successful response 
// from offscreen document before continuing
async function waitForOffscreenReady(retries = 100, interval = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({ type: "PING" }, (res) => {
                    if (chrome.runtime.lastError) reject(chrome.runtime.lastError)
                    else resolve(res)
                })
            })
            if (response?.ok) return true
        } catch (e) {
            if (DEBUG){
                console.log("offscreen document did not respond. retrying...")
            }
        }
        await new Promise(r => setTimeout(r, interval))
    }
    throw new Error("Offscreen document did not respond after retries")
    return false
}

/* 
    In order to ensure the offscreen document's existence, any messages from the main popup 
    must be sent through the background service to the offscreen document.
    One tip for the future:
    defining addListener as an async seems to cause a "message port was closed 
    before response was received", using a normal callback instead for ensureOffscreenDocument()
    https://stackoverflow.com/questions/73867123/message-port-closed-before-a-response-was-received-despite-return-true

*/
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.ensureOffscreenExists && message.type === "AUDIO_COMMAND") {
        return ensureOffscreenDocument().then(() => {
            return waitForOffscreenReady()
        }).then(() => {
            chrome.runtime.sendMessage({
                type: message.type + "_CONFIRMED",
                payload: message.payload,
                debug: DEBUG,
            })
            if (DEBUG){
                console.log("sent:", message.type + "_CONFIRMED")
            }
            sendResponse({ success: true })
            return true
        }).catch((err) => {
            console.error("Failed to contact offscreen document", err)
            sendResponse({ success: false, error: "Offscreen not ready" })
            return false
        })
    }
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