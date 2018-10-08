chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

	}
	}, 10);
});

var data = {
	info: {},
	list: []
}

var a = {
	tabData: function(req, res){
		console.log('tabData')
		console.log(data)
		res(data)
	},
	store: function(req, res){
		data.list.push(req.data);
	}
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(111)
    if (a[request.action]) a[request.action](request, function(){console.log(arguments); sendResponse(...arguments)});
    return !0;
});