function booting() {
	
	async function main() {
	  await countAppearances();
	  await uniqueWords();  
	  await uniqueAdjectives();
	  await stops();
	  await uncommon();
	  await calculateRatios();
	  await doubleAdjs();
	  await showResults();
	  updateProg("100%", "Ready!");
	  document.getElementById("myBar").style.width = ('100%');
	  $("#processing").fadeOut(500);
	}

	main();
	
	function countAppearances () {
		return new Promise(resolve => {		
			array.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
			allWords = getKeyByValue(counts,2).concat(getKeyByValue(counts,3),getKeyByValue(counts,4));
			typeFactor = wordcount/1000;
			updateProg("0%", "Counting word occurrences…");
			setTimeout(() => resolve(), 1000);
		})
	}
	
	function uniqueWords() {		
		return new Promise(resolve => {		
			updateProg("0%", "Detecting unique words…");
			var worker = new Worker("wrk1.js");
			worker.postMessage({ "args": [array ] });
			worker.onmessage = function (event) {
				if (event.data[0]<array.length-1) {
					var theProgress = reRange(event.data[0],0,wordcount,0,30);
					document.getElementById('prog').textContent = (theProgress + "%");
					document.getElementById("myBar").style.width = (theProgress+'%');
				}
				else {
					compareArray = event.data[1];
					worker.terminate();
					setTimeout(() => resolve(), 1000);
				}
			};
		})
	}
	function uniqueAdjectives() {
		return new Promise(resolve => {		
			updateProg("30%", "Finding unique adjectives…");
			for (var i = 0; i < compareArray.length; i++) {
				if (posOK(compareArray[i])) {
					uniqueAdjs.push(array[i]);
				}
			}
			setTimeout(() => resolve(), 1000);
		})
	}
	function stops() {		
		return new Promise(resolve => {		
			updateProg("35%", "Detecting stop words…");
			var worker = new Worker("wrk2.js");
			worker.postMessage({ "args": [array,stopWords ] });
			worker.onmessage = function (event) {
				if (event.data[0]<array.length-1) {
					var theProgress = reRange(event.data[0],0,wordcount,35,70);
					document.getElementById('prog').textContent = (theProgress + "%");
					document.getElementById("myBar").style.width = (theProgress+'%');
				}
				else {
					stopWordsCount = event.data[1];
					worker.terminate();
					setTimeout(() => resolve(), 1000);
				}
			};
		})
	}
	function uncommon() {		
		return new Promise(resolve => {		
			updateProg("70%", "Detecting uncommon words…");
			var worker = new Worker("wrk3.js");
			worker.postMessage({ "args": [array, common10k ] });			
			worker.onmessage = function (event) {
				if (event.data[0]<array.length-1) {
					var theProgress = reRange(event.data[0],0,wordcount,70,90);
					document.getElementById('prog').textContent = (theProgress + "%");
					document.getElementById("myBar").style.width = (theProgress+'%');
				}
				else {
					uncommonCount = event.data[1];
					worker.terminate();
					setTimeout(() => resolve(), 1000);
				}
			};
		})
	}
	function calculateRatios() {
		return new Promise(resolve => {	
			updateProg("90%", "Calculating ratios…"); 
			preDoubles = allWords.toString();
			doubles = preDoubles.split(",");
			uncommonWordsRatio = uncommonCount/wordcount*100;
			uniqueWordsRatio = compareArray.length/wordcount*typeFactor;
			uniqueAdjsRatio = uniqueAdjs.length/(wordcount-stopWordsCount)*100;
			vrr = ((uncommonWordsRatio + uniqueWordsRatio + uniqueAdjsRatio*4)/3).toFixed(2);
			setTimeout(() => resolve(), 1000);
		})
	}	
	function doubleAdjs () {
		updateProg("95%", "Detecting repetitive adjectives…");
		document.getElementById("myBar").style.width = ('95%');
		return new Promise(resolve => {
			for (var z = 0; z < doubles.length; z++) {
				if ((RiTa.containsWord(doubles[z])) && (posOK(doubles[z])) && (!commonAdjs.includes(doubles[z]))) {
					document.getElementById("reps").insertAdjacentHTML('beforeend', (doubles[z] + ", "));
				}
			}
			document.getElementById("reps").innerHTML = ((document.getElementById("reps").textContent.slice(0, -2)) + ".");
			setTimeout(() => resolve(), 1000);
		})
	}
	function showResults(){
		updateProg("99%", "Preparing results…");
		document.getElementById("myBar").style.width = ('99%');
		return new Promise(resolve => {
			document.getElementById("ci").innerHTML = ("Wordcount: <span style='color:cyan'>" + wordcount + "</span><br>Unique Words: <span style='color:cyan'>" + compareArray.length+ "</span> of which adjectives: <span style='color:cyan'>" + uniqueAdjs.length + "<br><br></span><b>Vocabulary Richness Ratio</b>: <span style='color:cyan'>" + vrr + "%</span>");
			setTimeout(
				function() {
					$("#results").fadeIn(2500);
			}, 300);
			setTimeout(() => resolve(), 700);
		})
	}
	function getKeyByValue(object, value) {
	  return Object.keys(object).filter(key => object[key] === value);
	}
	function posOK(w) {
		if ((RiTa.isAdjective(w)) && !(RiTa.isVerb(w)) && !(RiTa.isNoun(w)) && (w.slice(-2) != "er") && (w.slice(-3) != "est")) {
			return true;
		}
		else {
			return false;
		}
	}
	function updateProg(t, t2) {
		document.getElementById("prog").innerHTML = t;
		document.getElementById("prog2").innerHTML = t2;
	}
	function reRange(num, in_min, in_max, out_min, out_max){
		return Math.round((num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min);
	}
}