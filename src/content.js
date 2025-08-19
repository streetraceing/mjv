"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function injectScript(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = browser.runtime.getURL(path);
            script.onload = () => resolve(script);
            script.onerror = (e) => reject(new Error(`Can't load ${path}: ${e instanceof Error ? e.message : String(e)}`));
            document.head.appendChild(script);
        });
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("mjv content script start");
    if (/\bjson\b/i.test(document.contentType)) {
        console.log("mjv running");
        const html = document.documentElement;
        const pre = document.body.querySelector("pre");
        if (html.classList.contains("mjv-initialized") || !pre)
            return;
        else
            html.classList.add("mjv-initialized");
        const body = document.createElement("body");
        const previous_body = document.body;
        document.documentElement.replaceChild(body, document.body);
        previous_body.remove();
        body.dataset.path = browser.runtime.getURL("monaco/min/vs");
        body.dataset.worker = browser.runtime.getURL("monaco/min/vs/base/worker/workerMain.js");
        body.dataset.json = JSON.stringify(JSON.parse(pre.textContent || ""), null, 2);
        yield injectScript("monaco/min/vs/loader.js");
        yield injectScript("init.js");
    }
}))();
