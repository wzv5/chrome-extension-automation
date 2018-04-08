function init() {
	chrome.tabs.getSelected(function (tab) {
		var getUrl = tab.url;
		var domainUrl = getUrl.split('/');
		var setUrl = document.getElementById('currentUrl');
		setUrl.outerHTML = '<input type = text id = "currentUrl" value =' + domainUrl[2] + '/>';
	});

    chrome.management.getAll(load_extensions);
    $("#enterBtn").click(function() {
        var selectedExt = document.getElementById("dropdown_ext_list").value;
		var filterWords = document.getElementById("currentUrl").value;
		var bEnable = document.getElementById("bEnable").value;
		addStore(selectedExt, filterWords, bEnable);
		window.close();
    });
}

$(function() {
    $("#goto1").click(function() { window.open(chrome.extension.getURL('options.html')) });
    init();
});