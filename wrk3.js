//
self.addEventListener("message", function(e) {
	var args = e.data.args;
	var array = args[0];
	var common10k = args[1];
	var uncommonCount = 0;
	// do whatever you need with the arguments
	for (var i = 0; i < array.length; i++) {
		if (!common10k.includes(array[i])) {
			uncommonCount ++;
		}
		if (i<array.length-1) {
			postMessage([i, 0]);
		}
		else {
			postMessage([i,uncommonCount]);
		}
	}
}, false);