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
            script.onerror = (e) => reject(new Error(`Не удалось загрузить ${path}: ${e instanceof Error ? e.message : String(e)}`));
            document.head.appendChild(script);
        });
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const html = document.documentElement;
    const pre = document.body.querySelector("pre");
    if (["application/json", "text/json", "application/ld+json"].includes(document.contentType || "")) {
        if (html.classList.contains("mjv-initialized") || !pre)
            return;
        html.classList.add("mjv-initialized");
        const body = document.createElement("body");
        document.documentElement.replaceChild(body, document.body);
        body.dataset.path = browser.runtime.getURL("monaco/min/vs");
        body.dataset.worker = browser.runtime.getURL("monaco/min/vs/base/worker/workerMain.js");
        body.dataset.json = JSON.stringify(JSON.parse(pre.textContent || ""), null, 2);
        yield injectScript("monaco/min/vs/loader.js");
        yield injectScript("init.js");
    }
}))();
