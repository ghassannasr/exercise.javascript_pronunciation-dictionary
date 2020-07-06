

async function appEntry(evt) {
  try {
    //let file = evt.target.files[0];
    let fileContent = await getSingleFileAsText(evt);
    //console.log(fileContent);
    let dictionary = new Dictionary(fileContent);
    
    //example of using Word class method getPronunciation
    //let's pick a word ... "RIGHT"
    let wordStr = "RIGHT";
    let word = dictionary.findWord(wordStr);
    console.log(`Word found! ... ${word.toString()}`);
    let pronunciation = word.getPronunciation();
    console.log(`The pronunciation of the word ${word.getSpelling()} is ${pronunciation}`);
    console.log(`Checking for words with identical pronunciation to the word ${wordStr} ...`);
    let similarWords = word.getIdentical(dictionary);
    if(similarWords.length == 0) {
      console.log(`\tNo identically sounding words were found.`);
    }
    else {
      console.log(`\tThe word ${wordStr} is pronounced identically to:`);
      for ( let i = 0; i < similarWords.length; i++ ) {
        console.log(`\t\t${similarWords[i].word}`);
      }
    }
  }
  catch(err) {
    console.log(err);
  }
}


function getSingleFileAsText(evt) {
  return new Promise((resolve, reject) => {
    //Retrieve the first (and only!) File from the FileList object
    let result = "";
    
    let file = evt.target.files[0];
    
    if (file) {
      let fileReader = new FileReader();
      fileReader.onload = function (event) {
        let contents = event.target.result;
        resolve(contents);
      }

      fileReader.onerror = reject
      
      fileReader.readAsText(file);
    }
  })
}


let fileInput = document.getElementById('fileinput');
fileInput.addEventListener('change', appEntry, false);




class Dictionary {
  constructor(dictText) {
    this.dictionary = this.parseTextFile(dictText);
    this.findWord = function(word) {
      for( let i = 0; i < this.dictionary.length; i++ ) {
        let currWord = this.dictionary[i];
        if(currWord.getSpelling() === word) {
          //console.log(`found the word ${currWord.getSpellling}`);
          return currWord;
        }
      }
      return null;
    }
  }
  parseTextFile(dict) {
    let dictionary = [];
    let dictArr = dict.split("\n");
    
    //find index of last comment line
    let indexOfLastCommentLine = 0;
    for ( let row = 0; row < dictArr.length; row++) {
      let rowArr = dictArr[row].split(" ");
      if(rowArr[0] == ";;;") {
        indexOfLastCommentLine++;
      }
      else {
        break;
      }
    }
    
    for ( let row = indexOfLastCommentLine; row < dictArr.length; row++) {
      let rowArr = dictArr[row].split("  ");
      let thisWord = new Word(rowArr[0], rowArr[1].split(" "));
      dictionary.push(thisWord);
    }
    return dictionary;
  }
}


class Word {
  constructor(word, phonemes=[]) {
    this.word = word;
    this.phonemes = phonemes;
  }

  //returns a list of strings representative of the Phonemes of this word. Indices of the respective list should be indicative of their order of annunciation.
  getPronunciation() {
    return this.phonemes.join(" > ");
  }

  //return a list of all similar sounding-words
  getSimilarWords() {

  }

  //return a list of phonetically identical words
  getIdentical(dictionary) {
    let dict = dictionary.dictionary;
    let similarWords = [];
    for( let i = 0; i < dict.length; i++ ) {
      let similar = true;
      if(this.phonemes.length != dict[i].phonemes.length) {
        similar = false;
      }
      else {
        for( let j = 0; j < this.word.length; j++ ) {
          if(this.phonemes[j] != dict[i].phonemes[j]) {
            similar = false;
            continue;
          }
        }
      }
      if(similar) {
        similarWords.push(dict[i]);
      }
    }

    return similarWords;
  }

  //return a list of words which contain sub-Phonemes
  getSimilarWordsWithSubPhonemes() {

  }

  //return a list of near-phonetically-identical words with additional Phonemes added
  getSimilarWordsWithPhonemes() {

  }

  //returns the string value input upon construction
  getSpelling() {
    return this.word;
  }

  toString() {
    return `${this.word}: ${this.phonemes.join(" ")}`;
  }

}

