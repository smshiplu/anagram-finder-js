const anagramMap = new Map();

async function fetchAnagramMeaning(wordArr) {
  anagramMap.clear();

  for (const word of wordArr) {
    try {
      
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

      if(!response.ok) {
        throw new Error(`Meaning cannot be fetch: ${response.status}`);
      }

      const data = await response.json();

      if(data.length > 0) {
        anagramMap.set(word, data);
      }

    } catch (error) {
      // throw error;
    }
  }
}

export {
  anagramMap,
  fetchAnagramMeaning
}