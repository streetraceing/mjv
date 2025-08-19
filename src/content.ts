async function injectScript(path: string): Promise<HTMLScriptElement> {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script")

        script.src = browser.runtime.getURL(path)
        script.onload = () => resolve(script)
        script.onerror = (e) => reject(new Error(`Can't load ${path}: ${e instanceof Error ? e.message : String(e)}`))

        document.head.appendChild(script)
    })
}

(async () => {
    if (
        /\bjson\b/i.test(document.contentType)
    ) {
        const html = document.documentElement
        const pre = document.body.querySelector("pre")

        if (html.classList.contains("mjv-initialized") || !pre) return
        else html.classList.add("mjv-initialized")

        const body = document.createElement("body")
        const previous_body = document.body

        document.documentElement.replaceChild(body, document.body)
        previous_body.remove()

        body.dataset.path = browser.runtime.getURL("monaco/min/vs")
        body.dataset.worker = browser.runtime.getURL("monaco/min/vs/base/worker/workerMain.js")
        body.dataset.json = JSON.stringify(JSON.parse(pre.textContent || ""), null, 2)

        await injectScript("monaco/min/vs/loader.js")
        await injectScript("init.js")
    }
})()