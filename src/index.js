import "./index.css";

import * as ui from "./lib/ui.js";
import * as api from "./utils/dictionary-api.js";
import getAIResponse from  "./utils/ai.js";


const searchFormEl = document.getElementById("searchForm");

document.addEventListener('DOMContentLoaded', function() {
  document.body.removeAttribute("style");
  document.querySelector("header").removeAttribute("style");
  document.querySelector("main").removeAttribute("style");
});

// window.onload = function() {
//   document.querySelector("header").classList.remove('hidden');
//   document.querySelector("main").classList.remove('hidden');
// };

searchFormEl.addEventListener("submit", async e => {
  e.preventDefault();

  try {
    ui.showLoadingSmall();
    const searchTerm = e.target.search.value.trim().toLowerCase();
  
    if(!searchTerm) {
      throw new Error("Enter a word!");
    }

    const prompt = `Return all possible meaningful English-only anagrams of the word "${searchTerm}" in a comma-separated text only. The anagram words should be exactly ${searchTerm.length} characters long. If the comma separated text response contains any word that is same as ${searchTerm}", then exclude that word from the comma separated text. If the anagram words don't consist of letters with '${searchTerm.split("").join(", ")},' or if the given word "${searchTerm}" is not a valid and meaningful English word that you cannot make any sense of or don't find any meaningful English anagrams for, or if you find only a word that is same word as "${searchTerm}", then return the word "Sorry" only. Except these instructions return nothing`;

    const result = await getAIResponse(prompt);

    if( result === "Sorry") {
      throw new Error("No anagram found!");
    }

    const resultArr = [...new Set(result.split(","))].filter(item => item.trim() !== "");
    
    if(resultArr.length < 1 || (resultArr.length === 1 && resultArr.includes(searchTerm))) {
      throw new Error("No anagram found!");
    }

    if(!resultArr.includes(searchTerm)) {
      resultArr.unshift(searchTerm);
    }

    try {
      ui.showLoadingSmall();

      await api.fetchAnagramMeaning(resultArr);
      
      if(api.anagramMap.size < 1 || api.anagramMap.size === 0) {
        throw new Error("No anagram found!");
      }
      
      ui.displayResult(searchTerm, api.anagramMap);

      ui.hideLoadingSmall(true);

    } catch (error) {

      throw error;
    }

    ui.hideLoadingSmall(true);

  } catch (error) {

    ui.hideLoadingSmall(false);
    ui.showMessage(error.message);
    console.error(`Error: ${error.message}`);
  } 
  
  e.target.reset();
});

ui.favicon();
ui.bgImage();
ui.copyrightText();

