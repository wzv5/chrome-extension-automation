//Copyright © Russell Hoy 2012 All Right Reserved. 
//No parts of this document may be used in any published or commercial
//materials without prior consent. I would happy to share this code, but I prefer being asked first.

function load_extensions(extensions) {
	var x = document.getElementById("dropdown_ext_list");
	var optionArray = [];
	for (var i of extensions) {
		if (i.type == "extension" && (i.name != 'Extension Automation')) {
			optionArray.push([i.name, i.id]);
		}
	}
	optionArray.sort();
	while (x.options.length > 0) {
		x.options[0] = null;
	}
	for (var p in optionArray) {
		var op = new Option(optionArray[p][0], optionArray[p][1]);
		x.options[p] = op;
	}
}

function addStore(extId, filterText, bEnable) {
	chrome.management.get(extId, function (ext) {
		if (ext.type != "extension") {
			return;
		}
		var storedEntry = JSON.parse(getLocalStorage().getItem(ext.id));
		var filterWords = [];
		var enable = true;
		if (storedEntry != null) {
			for (i in storedEntry.filterWords) {
				if (storedEntry.filterWords[i] == filterText) {
					return;
				}
				filterWords.push(storedEntry.filterWords[i]);
			}
		}
		filterWords.push(filterText);
		if (bEnable == "Enable") {
			enable = true;
		} else {
			enable = false;
		}
		var entry = {
			id: ext.id,
			name: ext.name,
			bEnable: enable,
			bActivated: false,
			filterWords: filterWords
		}
		getLocalStorage().setItem(ext.id, JSON.stringify(entry));
	});
}

function getLocalStorage() {
	return chrome.extension.getBackgroundPage().localStorage;
}