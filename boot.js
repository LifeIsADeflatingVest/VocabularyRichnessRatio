function booting() {
	
	async function main() {
	  await countAppearances();
	  await uniqueWords();  
	  await stops();
	  await uncommon();
	  await calculateRatios();
	  await doubleAdjs();
	  await showResults();
	  updateProg("100%", "Ready!");
	  $("#processing").fadeOut(500);
	}

	main();
	
	function countAppearances () {
		return new Promise(resolve => {		
			array.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
			allWords = getKeyByValue(counts,2).concat(getKeyByValue(counts,3),getKeyByValue(counts,4));
			typeFactor = wordcount/1000;
			updateProg("15%", "Finding unique words…");
			setTimeout(() => resolve(), 1000);
		})
	}
	
	function uniqueWords() {		
		return new Promise(resolve => {		
			updateProg("30%", "Detecting stop words…");
			for (var i = 0; i < array.length; i++) {
				if (!(compareArray.includes(array[i]))) {
					compareArray.push(array[i]);
					if (posOK(array[i])) {
						uniqueAdjs.push(array[i]);
					}
				}
			}
			setTimeout(() => resolve(), 1000);
		})
	}
	function stops() {		
		return new Promise(resolve => {		
			updateProg("45%", "Detecting uncommon words…");
			for (var i = 0; i < array.length; i++) {
				if (stopWords.includes(array[i])) {
					stopWordsCount ++;
				}
			}
			setTimeout(() => resolve(), 1000);
		})
	}
	function uncommon() {		
		return new Promise(resolve => {		
			updateProg("60%", "Calculating ratios…");
			for (var i = 0; i < array.length; i++) {
				if (!common10k.includes(array[i])) {
					uncommonCount ++;
				}
			}
			setTimeout(() => resolve(), 1000);
		})
	}
	function calculateRatios() {
		return new Promise(resolve => {	
			updateProg("75%", "Detecting repetitive adjectives…"); 
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
		updateProg("90%", "Preparing results…");
		return new Promise(resolve => {
			for (var z = 0; z < doubles.length; z++) {
				if ((RiTa.containsWord(doubles[z])) && (posOK(doubles[z])) && (!commonAdjs.includes(doubles[z]))) {
					document.getElementById("reps").insertAdjacentHTML('beforeend', (doubles[z] + ", "));
				}
			}
			document.getElementById("reps").innerHTML = ((document.getElementById("reps").textContent.slice(0, -2)) + ".");
			setTimeout(() => resolve(), 500);
		})
	}
	function showResults(){
		updateProg("99%", "Cleaning up…");
		return new Promise(resolve => {
			document.getElementById("ci").innerHTML = ("Wordcount: <span style='color:cyan'>" + wordcount + "</span><br>Unique Words: <span style='color:cyan'>" + compareArray.length+ "</span> of which adjectives: <span style='color:cyan'>" + uniqueAdjs.length + "<br><br></span><b>Vocabulary Richness Ratio</b>: <span style='color:cyan'>" + vrr + "%</span>");
			setTimeout(
				function() {
					$("#results").fadeIn(2500);
			}, 300);
			setTimeout(() => resolve(), 500);
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
}