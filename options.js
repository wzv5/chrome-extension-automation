function init() {
	getStored(); //fill export box
	firstRun();
	//bind accordians
	//$(".toggle").slideUp(); //start up
	$(".trigger").click(function () {
		$(this).next(".toggle").slideToggle("medium");
	});

	form = document.getElementById("prefs-form");
	chrome.management.getAll(load_extensions);
	form.addEventListener("submit", function (event) {
		var selectedExt = document.getElementById("dropdown_ext_list").value;
		var filterWords = document.getElementById("txtEnter").value;
		var bEnable = document.getElementById("bEnable").value;
		addStore(selectedExt, filterWords, bEnable);
	});
	makeTable();
}

function firstRun() {
	//make sure old users don't have corrupt data from old localStorage.
	var firstRun = (getLocalStorage()['firstRun'] == 'true');
	if (!firstRun) {
		getLocalStorage().clear();
		getLocalStorage()['firstRun'] = 'true';
	}
}

function makeTable() {

	var table = document.getElementById("prefs-table");
	table.innerHTML = "";
	if (getLocalStorage().length > 1) {
		table.innerHTML = '<tr><th>Extension</th> <th>Filter</th></tr>';
	}
	var $tbody = document.createElement("tbody");
	for (var i = 0; i < getLocalStorage().length; i++) {
		var extId = getLocalStorage().key(i);
		if (extId == "undefined" || extId == "firstRun") {
			continue;
		}
		chrome.management.get(extId, function (ext) {
			var entry = JSON.parse(getLocalStorage().getItem(ext.id));
			if (entry == null) {
				return;
			}
			var $tr = document.createElement("tr");
			$tr.setAttribute('id', entry.bEnable);
			var $td = document.createElement("td");
			var extensionName = document.createElement('a');
			document.createTextNode(entry.name);

			//add icons if possible
			try {
				if (ext.icons[1]) {
					extensionName.innerHTML = "<img src=" + ext.icons[1].url + " width = 30 height = 30 />  "
				} else if (ext.icons[0]) {
					extensionName.innerHTML = "<img src=" + ext.icons[0].url + " width = 30 height = 30 />  "
				} else if (ext.icons[2]) {
					extensionName.innerHTML = "<img src=" + ext.icons[2].url + " width = 30 height = 30 />  "
				} else {
					extensionName.innerHTML = "<img src='blank.png'; width = 30; height = 30 />  "
				}
			} catch (err) {
				extensionName.innerHTML = "<img src='blank.png'; width = 30; height = 30 />  "
			}
			//add disable sign
			extensionName.innerHTML += "<img src= 'nosign1.png'; class = 'nosign'/>"
			extensionName.innerHTML += ext.name;
			$td.appendChild(extensionName);
            $td.setAttribute('class', entry.id);
            $td.onclick = function() { switchMode(this.className); };
			$tr.appendChild($td);
			$td = document.createElement("td");

			for (i in entry.filterWords) {
				var enable_words = document.createElement('span');
				enable_words.innerHTML = entry.filterWords[i] + "," + "<br>";
				enable_words.setAttribute('class', entry.id);
                enable_words.setAttribute('id', i);
                enable_words.onclick = function() { removeItem(this.className, this.id); };
				$td.appendChild(enable_words);
			}
			$tr.appendChild($td);
			$tbody.appendChild($tr)
			table.appendChild($tbody)
		});
	}
	getStored();
}

function getStored() {
	$('#export').val(JSON.stringify(getLocalStorage()));
}

function setStored() {
	var string = $('#import').val();
	try {
		var data = JSON.parse(string);
		for (var key in data) {
			getLocalStorage()[key] = data[key];
		}
		firstRun();
		makeTable();

		$('#flash').fadeIn('medium', function () {
			$('#flash').fadeOut(2000);
		});
	} catch (err) {
		alert("Sorry, there was a problem importing data. Most likely, the imported data has a formatting mistake. Details: " + err);
	}
}

function selectAll(id) {
	document.getElementById(id).focus();
	document.getElementById(id).select();
}

function removeItem(entryId, word) {
	var storedEntry = JSON.parse(getLocalStorage().getItem(entryId));
	storedEntry.filterWords.splice(word, 1);
	if (storedEntry.filterWords.length == 0) { //if no filter words left, delete entry
		getLocalStorage().removeItem(entryId);
	} else {
		getLocalStorage().setItem(entryId, JSON.stringify(storedEntry));
	}
	makeTable();
}

function switchMode(entryId) {
	var storedEntry = JSON.parse(window.getLocalStorage().getItem(entryId))
	if (storedEntry.bEnable == false) { //if disabled, enable
		storedEntry.bEnable = true;
		window.getLocalStorage().setItem(entryId, JSON.stringify(storedEntry));
	} else {
		storedEntry.bEnable = false;
		window.getLocalStorage().setItem(entryId, JSON.stringify(storedEntry));
	}
	makeTable();
}

function doClear() {
	var r = confirm("Erase all saved settings?");
	if (r == true) {
		getLocalStorage().clear();
		firstRun();
		makeTable();
	}
}

$(function () {
	$("#btn_clear").click(doClear);
	$("#export").click(function () {
		selectAll("export");
	});
	$("#btn_import").click(setStored);
	$("#manage_ext").click(function () {
		chrome.tabs.create({
			url: "chrome://extensions"
		});
	});
	init();
});