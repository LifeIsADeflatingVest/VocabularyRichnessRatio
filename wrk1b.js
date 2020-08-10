//
self.importScripts('rita-full.min.js');
self.addEventListener("message", function(e) {
	var args = e.data.args;
	var compareArray = args[0];
	var uniqueAdjs = [];
	// do whatever you need with the arguments
	for (var i = 0; i < compareArray.length; i++) {
		if (posOK(compareArray[i])) {
			uniqueAdjs.push(array[i]);
		}
		if (i<array.length-1) {
			postMessage([i, 0]);
		}
		else {
			postMessage([i,uniqueAdjs]);
		}
	}
	//
	function posOK(w) {
		if ((RiTa.isAdjective(w)) && !(RiTa.isVerb(w)) && !(RiTa.isNoun(w)) && (w.slice(-2) != "er") && (w.slice(-3) != "est")) {
			return true;
		}
		else {
			return false;
		}
	}
}, false);