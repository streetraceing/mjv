"use strict";
const container = document.body;
const languages = ["ru", "de", "es", "fr", "it", "ja", "ko", "zh-cn", "zh-tw"];
const active_language = navigator.language.toLowerCase().split("-")[0];
window.MonacoEnvironment = {
    getWorkerUrl: () => container.dataset.worker
};
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    monaco.editor.setTheme(e.matches ? "vs-dark" : "vs-light");
});
require.config({ paths: { vs: container.dataset.path } });
function initMonaco() {
    require(["vs/editor/editor.main"], () => {
        const editor = monaco.editor.create(container, {
            value: container.dataset.json,
            language: "json",
            readOnly: true,
            automaticLayout: true,
            theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "vs-dark" : "vs-light",
            scrollBeyondLastLine: false,
            renderWhitespace: "none",
            lineNumbersMinChars: (container.dataset.json.split("\n").length.toString().length + 1)
        });
    });
}
if (languages.includes(active_language)) {
    require([`${container.dataset.path}/nls/nls.messages.${active_language}`], initMonaco, () => {
        console.warn(`NLS for "${active_language}" not found`);
        initMonaco();
    });
}
else {
    initMonaco();
}
