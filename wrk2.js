//
self.addEventListener("message", function(e) {
	var args = e.data.args;
	var array = args[0];
	var stopWords = args[1];
	var stopWordsCount = 0;
	// do whatever you need with the arguments
	for (var i = 0; i < array.length; i++) {
		if (stopWords.includes(array[i])) {
			stopWordsCount ++;
		}
		if (i<array.length-1) {
			postMessage([i, 0]);
		}
		else {
			postMessage([i,stopWordsCount]);
		}
	}
}, false);