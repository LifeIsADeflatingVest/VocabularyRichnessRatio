function booting() {
	

async function main() {
  await countAppearances();
  await uniqueWords();  
  await stops();
  await uncommon();
  await calculateRatios();
  await doubleAdjs();
  await showResults();
  updateProg("100%");
  $("#processing").fadeOut(500);
}

main()
	/*
	updateProg("0%");
	countAppearances();
	updateProg("20%");
	uniqueWords();
	updateProg("50%");
	calculateRatios();
	updateProg("80%");
	showResults();
	updateProg("90%");
	doubleAdjs();
	*/
	
	function uniqueWords() {		
		return new Promise(resolve => {		
			updateProg("30%");
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
			updateProg("45%");
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
			updateProg("60%");
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
			updateProg("75%"); 
			preDoubles = wordsX.toString();
			doubles = preDoubles.split(",");
			uncommonWordsRatio = uncommonCount/wordcount*100;
			uniqueWordsRatio = compareArray.length/wordcount*typeFactor;
			uniqueAdjsRatio = uniqueAdjs.length/(wordcount-stopWordsCount)*100;
			vrr = ((uncommonWordsRatio + uniqueWordsRatio + uniqueAdjsRatio*4)/3).toFixed(2);
			setTimeout(() => resolve(), 1000);
		})
	}	
	function countAppearances () {
		return new Promise(resolve => {		
			array.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });		
			if (wordcount > 150000) { // very long novel
				typeFactor = 140;
				wordsX = getKeyByValue(counts,4);
			}
			else if ((wordcount <= 150000) && (wordcount > 100000)) { // long novel
				typeFactor = 120;
				wordsX = getKeyByValue(counts,4);
			}
			else if ((wordcount <= 100000) && (wordcount > 50000)) { // novel
				typeFactor = 100;
				wordsX = getKeyByValue(counts,3);
			}
			else if ((wordcount <= 50000) && (wordcount > 20000)) { // novella
				typeFactor = 80;
				wordsX = getKeyByValue(counts,3);
			}
			else if ((wordcount <= 20000) && (wordcount > 1500)) { //short story
				typeFactor = 60;
				wordsX = getKeyByValue(counts,2);
			}
			else { // poems
				typeFactor = 30;
				wordsX = getKeyByValue(counts,2);
			}	
			updateProg("15%");
			setTimeout(() => resolve(), 1000);
		})
	}
	function doubleAdjs () {
		updateProg("90%");
		return new Promise(resolve => {
			for (var z = 0; z < doubles.length; z++) {
				if ((!hasNumber(doubles[z])) && (RiTa.containsWord(doubles[z])) && (posOK(doubles[z])) && (!commonAdjs.includes(doubles[z]))) {
					document.getElementById("reps").insertAdjacentHTML('beforeend', (doubles[z] + ", "));
				}
			}
			document.getElementById("reps").innerHTML = ((document.getElementById("reps").textContent.slice(0, -2)) + ".");
			setTimeout(() => resolve(), 500);
		})
	}
	function showResults(){
		updateProg("99%");
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
	function hasNumber(myString) {
	  return /\d/.test(myString);
	}
	function posOK(w) {
		if ((RiTa.isAdjective(w)) && !(RiTa.isVerb(w)) && !(RiTa.isNoun(w)) && (w.slice(-2) != "er") && (w.slice(-3) != "est")) {
			return true;
		}
		else {
			return false;
		}
	}
	function updateProg(t) {
		document.getElementById("prog").innerHTML = t;
	}
}