browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status !== "complete" || !tab.url) return

    if (/\.(json|har)(\?|$)/i.test(tab.url) || tab.url.startsWith("data:application/json")) {
        try {
            await browser.scripting.executeScript({
                target: { tabId },
                files: ["content.js"]
            })
        } catch (err) {
            browser.notifications.create({
                type: "basic",
                iconUrl: browser.runtime.getURL("icons/logo.png"),
                title: "Monaco JSON Viewer disabled",
                message: "The integrated Firefox viewer interferes with the extension.\nTurn off the devtools.jsonview.enabled in about:config."
            })
        }
    }
})