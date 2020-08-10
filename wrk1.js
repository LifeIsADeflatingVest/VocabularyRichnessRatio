//
self.addEventListener("message", function(e) {
	var args = e.data.args;
	var array = args[0];
	var compareArray = [];
	// do whatever you need with the arguments
	for (var i = 0; i < array.length; i++) {
		if (!(compareArray.includes(array[i]))) {
			compareArray.push(array[i]);
		}
		if (i<array.length-1) {
			postMessage([i, 0]);
		}
		else {
			postMessage([i,compareArray]);
		}
	}
}, false);