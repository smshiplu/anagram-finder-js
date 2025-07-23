import Image from "../images/alphabet.png";
import Favicon from "../images/favicon.svg";
const resultEl = document.getElementById("result");
const loadingEl = document.getElementById("loading");
const inputEL = document.getElementById("search");
const submitBtn = document.getElementById("submit");
const messageEl = document.getElementById("message");

let timeLeft;
let timer;

function favicon() {
  document.getElementById("favicon").setAttribute("href", Favicon);
}

function bgImage() {
  document.getElementById("bgImage").setAttribute("style", `background-image:url(${Image})`);
  document.getElementById("bgImage").classList.add("mask-linear-50", "mask-linear-from-60%", "-linear-to-80%");
}

function showLoadingSmall() {
  loadingEl.classList.remove("hidden");
  // loadingEl.classList.add("visible");
  loadingEl.innerHTML = `
    <div class="text-center">
      <div role="status">
        <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  `;

  inputEL.disabled = true;
  submitBtn.disabled = true;
  submitBtn.classList.add("pointer-events-none");
  resultEl.classList.add("hidden");
}

function hideLoadingSmall(shouldShowResult) {
  // loadingEl.classList.remove("visible");
  loadingEl.classList.add("hidden");
  loadingEl.innerHTML = "";
  if(shouldShowResult) {
    resultEl.classList.remove("hidden");
  } else {
    resultEl.classList.add("hidden");
  }

  inputEL.disabled = false;
  submitBtn.disabled = false;
  submitBtn.classList.remove("pointer-events-none");
}

function showMessage(message) {
  timeLeft = 10;
  clearInterval(timer);

  timer = setInterval(() => {
    timeLeft --;
    
    messageEl.classList.remove("hidden");
    messageEl.innerHTML = messageTemplate(message);
    closeMessage();

    if(timeLeft === 0) {
      clearInterval(timer);
      messageEl.classList.add("hidden");
      messageEl.innerHTML = "";
    } 
  }, 1000);
}

function messageTemplate(message) {
  return `
    <div id="toast-default" class="flex items-center justify-between w-full max-w-xs m-auto p-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-700 dark:bg-rose-300 dark:hover:bg-rose-400" role="alert">
      
      <div class="ms-3 text-sm font-normal">${message}</div>

      <button type="button" id="message-close" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-slate-300 dark:hover:bg-slate-400 cursor-pointer">
          <span class="sr-only">Close</span>
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
      </button>
    </div>`;
}

function closeMessage() {
  document.getElementById("message-close").addEventListener("click", () => {
    clearInterval(timer);
    timeLeft = 0;
    messageEl.classList.add("hidden");
    messageEl.innerHTML = "";
  });
}

function displayResult(searchTerm, resultMap) {

  resultEl.classList.remove("hidden");

  document.getElementById("main-word").innerText = searchTerm;
  document.getElementById("anagram").innerText = resultMap.size > 1 ? `Anagrams(${resultMap.size})` : `Anagram(1)`;
  
  const mainWordValue = resultMap && resultMap.get(searchTerm).shift();  

  document.getElementById("parent-accordion-collapse-body-1").firstElementChild.innerHTML = "";
  mainWordValue.meanings.forEach(item => {
    document.getElementById("parent-accordion-collapse-body-1").firstElementChild.innerHTML += mainWordResultTemplate(item);
  });

  // remove main word from map, so that anagrams doesn't contain main word;  
  resultMap.delete(searchTerm);
  
  document.getElementById("accordion-nested-children").innerHTML = "";
  resultMap.forEach((value, key) => {
    document.getElementById("accordion-nested-children").innerHTML += anagramTitleTemplate(key);

    value[0].meanings.forEach(item => {
      document.getElementById("accordion-nested-children").innerHTML += anagramBodyTemplate(item);
    });
  });

  accordionToggle();
}

function mainWordResultTemplate(item) {
  return `
    <dl class="p-4">
    <dt class="bg-gray-800 font-bold pl-2 pt-2 border-l-2 border-amber-500">Part of speech</dt>
    <dd class="bg-gray-800 px-4 pb-2 mb-4 border-l-2 border-amber-500">${item.partOfSpeech}</dd>

    <dt class="bg-slate-800 font-bold pl-2 pt-2 border-l-2 border-amber-500">Definition</dt>
    <dd class="bg-slate-800 px-4 pb-2 mb-4 border-l-2 border-amber-500">${item.definitions[0].definition}</dd>
  </dl>
  `;
}

function anagramTitleTemplate(title) {
  return `
    <h2 class="child-accordion-nested-heading" >
      <button type="button" class="flex items-center justify-between w-full p-5 rounded-t-xl font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3 cursor-pointer">
        <span class="capitalize">${title}</span>
        <svg data-accordion-icon class="w-3 h-3  shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
          </svg>
      </button>
    </h2>
  `;
}

function anagramBodyTemplate(item) {
  return `
    <div class="child-accordion-nested-body hidden">
      <div class="p-5 border border-b-0 border-gray-200 dark:border-gray-700">
        <dl class="p-4">
          <dt class="bg-gray-800 font-bold pl-2 pt-2 border-l-2 border-amber-500">Part of speech</dt>
          <dd class="bg-gray-800 px-4 pb-2 mb-4 border-l-2 border-amber-500">${item.partOfSpeech}</dd>

          <dt class="bg-slate-800 font-bold pl-2 pt-2 border-l-2 border-amber-500">Definition</dt>
          <dd class="bg-slate-800 px-4 pb-2 mb-4 border-l-2 border-amber-500">${item.definitions[0].definition}</dd>
        </dl>
      </div>
    </div>
  `;
}

function accordionToggle() {
  const parentAccordionTitle = document.querySelectorAll("#accordion-nested-parent h2");
  parentAccordionTitle.forEach(title => {
    title.addEventListener("click", () => {
      title.children[0].lastElementChild.classList.toggle("rotate-180")
      title.nextElementSibling.classList.toggle("hidden");
    })
  });
}

function copyrightText() {
  const dt = new Date().toDateString().split(" ");
  const year = dt[dt.length - 1];
  
  document.querySelector("#copyright-text").innerHTML = `© <span>${year}</span> Anagram Finder. All rights reserved.`;
}

export {
  favicon,
  bgImage,
  showLoadingSmall,
  hideLoadingSmall,
  showMessage,
  displayResult,
  copyrightText
}