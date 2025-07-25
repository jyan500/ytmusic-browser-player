import axios from "axios"

const DEBUG = true 
const OFFSCREEN_PATH = "offscreen.html"
const POPUP_PATH = "popup.html"
// https://developer.chrome.com/docs/extensions/reference/api/offscreen
let creating // A global promise to avoid concurrency issues
let tabHeaders = {}

chrome.webRequest.onSendHeaders.addListener(
    (details) => {
        const headerNames = ["x-goog-pageid", "authorization", "user-agent", "accept", "accept-language", "content-type", "x-goog-authuser", "x-origin", "cookie"]
        const headers = details.requestHeaders || [];
        const relevant = headers.reduce((acc, header) => {
            if (headerNames.includes(header.name.toLowerCase())){
                 acc[header.name] = header.value 
            }
            return acc
        }, {})
        if (details.tabId >= 0){
            tabHeaders[details.tabId] = relevant 
        }
        chrome.storage.local.set({ ytMusicHeaders: relevant });
    },
    { urls: ["https://music.youtube.com/youtubei/v1/browse?ctoken=*"] },
    ["requestHeaders", "extraHeaders"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        if (details.tabId >= 0) {
            tabHeaders[details.tabId] = details.requestHeaders;
        }
    },
    { urls: ["https://music.youtube.com/*"] },
    ["requestHeaders"]
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "refresh-music-youtube-tabs") {
        chrome.tabs.query({ url: "https://music.youtube.com/*" }, (tabs) => {
            if (tabs.length === 0) {
                sendResponse({ success: false, message: "No matching tabs found" });
                return;
            }

            tabs.forEach((tab) => {
                if (tab.id !== undefined) {
                    chrome.tabs.update(tab.id, { url: "https://music.youtube.com/library" });;
                }
            });

            sendResponse({ success: true, reloadedCount: tabs.length });
        });

        // Allow async sendResponse
        return true;
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url?.startsWith("https://music.youtube.com")) {
        const headers = tabHeaders[tabId];
        if (headers) {
            chrome.storage.local.set({ ytMusicHeaders: headers });
            delete tabHeaders[tabId]; // cleanup
            // Send a message to the popup or content script
            chrome.runtime.sendMessage({
                type: "music-youtube-tab-loaded",
                tabId: tabId,
                url: tab.url
            })
        } else {
            console.log("No headers found for this tab");
        }
    }
});

// store the id so that when the window closes, we can stop the background audio
let extensionWindowId = null
chrome.action.onClicked.addListener((tab) => {
    // if there's already a window present with the popup,
    // focus it instead of opening a new one
    chrome.windows.getAll({populate: true}, (windows) => {
        for (const window of windows){
            for (const tab of window.tabs){
                if (tab.url === POPUP_PATH){
                    chrome.windows.update(window.id, {focused: true})
                    return
                }
            }
        }
    })

    chrome.windows.create({
        url: chrome.runtime.getURL(POPUP_PATH),
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

// Utility function to check if the extension window is still open
async function isExtensionWindowOpen(windowId) {
    const allWindows = await chrome.windows.getAll();
    return allWindows.some((win) => win.id === windowId)
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
            await setupOffscreenDocument(OFFSCREEN_PATH)
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
        setupOffscreenDocument(OFFSCREEN_PATH).then(() => {
            try {
                // await waitForOffscreenReady()
                // add slight delay to ensure offscreen is created
                setTimeout(() => {
                    chrome.runtime.sendMessage({
                        type: message.type + "_CONFIRMED",
                        payload: message.payload,
                        debug: DEBUG,
                    })
                }, 200)
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
chrome.windows.onFocusChanged.addListener(async (windowId) => {
    if (extensionWindowId == null) return

    const isOpen = await isExtensionWindowOpen(extensionWindowId)
    if (!isOpen){
        stopOffscreenKeepAlive()
        return
    }
    else {
        await setupOffscreenDocument(OFFSCREEN_PATH)
        startOffscreenKeepAlive()
        return;
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
        // stop keeping the offscreen document alive
        stopOffscreenKeepAlive()

        // close offscreen document
        const existingOffscreen = await checkAllWindowsForOffscreen(OFFSCREEN_PATH)
        if (existingOffscreen){
            await chrome.offscreen.closeDocument()
        }
        extensionWindowId = null
    }
})


