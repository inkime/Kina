chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({url: 'index.html'})
    chrome.tabs.executeScript(null, {
        file: [
            "js/ace.js",
            "js/ext-beautify.min.js",
            "js/ext-json.js",
            "js/ext-language_tools.js",
            "js/ext-searchbox.js",
            "js/ext-split.js",
            "js/mode-json.js",
            "js/theme-textmate.js",
            "js/worker-json.js",
            "js/jquery.min.js",
            "js/require.js",
            "js/script.js"
        ]
    });
});
