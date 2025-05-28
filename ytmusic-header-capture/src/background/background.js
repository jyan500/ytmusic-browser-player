import axios from "axios"

const DEBUG = true 
// https://developer.chrome.com/docs/extensions/reference/api/offscreen
let creating // A global promise to avoid concurrency issues

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



async function checkAllWindowsForOffscreen(path){
    // Check all windows controlled by the service worker to see if one
    // of them is the offscreen document with the given path
    const offscreenUrl = chrome.runtime.getURL(path)
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT'],
        documentUrls: [offscreenUrl]
    })

    return existingContexts.length > 0
}

async function setupOffscreenDocument(path) {
    const hasExistingContexts = await checkAllWindowsForOffscreen(path)
    if (hasExistingContexts){
        return true
    }

    // create offscreen document
    if (creating) {
        await creating
    } else {
        creating = chrome.offscreen.createDocument({
            url: path,
            reasons: ['AUDIO_PLAYBACK'],
            justification: 'Keep audio playing while extension UI is minimized'
        })
        await creating
        creating = null
    }
    return true
}

// wait for the offscreen document to be ready before sending the next command
// by sending a "ping" to the offscreen. Should expect a successful response 
// from offscreen document before continuing
async function waitForOffscreenReady(retries = 100, interval = 500) {
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

let keepAliveInterval; 
let isAudioPlaying = false

// Function to keep the offscreen doc alive
function startOffscreenKeepAlive() {
    if (keepAliveInterval != null) return;
    if (DEBUG){
        console.log("Starting offscreen keep-alive interval");
    }
    keepAliveInterval = setInterval(async () => {
        // If audio is playing, Chrome will keep the document alive on its own
        if (!isAudioPlaying) {
            await setupOffscreenDocument("offscreen.html")
        }
    }, 30000)
}

function stopOffscreenKeepAlive() {
    if (keepAliveInterval != null) {
        clearInterval(keepAliveInterval);
        keepAliveInterval = undefined;
        if (DEBUG){
            console.log("Stopped offscreen keep-alive interval");
        }
    }
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
    console.log("isAudioPlaying: ", isAudioPlaying)
    if (message.type === "AUDIO_STATE") {
        isAudioPlaying = message.playing;
        if (isAudioPlaying) {
            stopOffscreenKeepAlive()
        } else {
            startOffscreenKeepAlive()
        }
        sendResponse({ success: true })
        return true;
    }
    if (message.ensureOffscreenExists && message.type === "AUDIO_COMMAND") {
        setupOffscreenDocument("offscreen.html").then(async () => {
            try {
                await waitForOffscreenReady()
                chrome.runtime.sendMessage({
                    type: message.type + "_CONFIRMED",
                    payload: message.payload,
                    debug: DEBUG,
                })
                if (DEBUG){
                    console.log("sent:", message.type + "_CONFIRMED" + " " + message.payload.action)
                }
                sendResponse({ success: true })
            }
            catch (err){
                console.error(err)
                sendResponse({ success: false })
            }
            finally {
                return true
            }
        })
    }
    sendResponse({ success: true })
    return true
})

// Listen for focus changes
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        console.log("No window is focused");
        return;
    }

    if (windowId === extensionWindowId) {
        console.log("Extension window is focused");
        // when focused, setup offscreen window, and 
        // then call startOffscreenKeepAlive() 
        setupOffscreenDocument("offscreen.html").then(() => {
            startOffscreenKeepAlive()
        })
    } else {
        console.log("Another window is focused");
        stopOffscreenKeepAlive()
    }
});

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
        const existingOffscreen = await checkAllWindowsForOffscreen("offscreen.html")
        if (existingOffscreen){
            await chrome.offscreen.closeDocument()
        }
        extensionWindowId = null
    }
})


