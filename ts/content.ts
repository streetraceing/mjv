async function injectScript(path: string): Promise<HTMLScriptElement> {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script")
        script.src = browser.runtime.getURL(path)
        script.onload = () => resolve(script)
        script.onerror = (e) => reject(new Error(`Не удалось загрузить ${path}: ${e instanceof Error ? e.message : String(e)}`))
        document.head.appendChild(script)
    })
}

(async () => {
    const html = document.documentElement
    const pre = document.body.querySelector("pre")

    if (
        ["application/json", "text/json", "application/ld+json"].includes(document.contentType || "")
    ) {
        if (html.classList.contains("mjv-initialized") || !pre) return
        html.classList.add("mjv-initialized")

        const body = document.createElement("body")
        document.documentElement.replaceChild(body, document.body)

        body.dataset.path = browser.runtime.getURL("monaco/min/vs")
        body.dataset.worker = browser.runtime.getURL("monaco/min/vs/base/worker/workerMain.js")
        body.dataset.json = JSON.stringify(JSON.parse(pre.textContent || ""), null, 2)

        await injectScript("monaco/min/vs/loader.js")
        await injectScript("init.js")
    }
})()