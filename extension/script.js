// script.js
const apiEndpoint = 'http://100.64.161.177:5000/';
const apiEndpoint2 = 'http://100.64.174.161:5002/process_link';
const apiEndpoint3 = 'http://100.64.174.161:5003/ask_question';
const apiEndpointDelete = 'http://100.64.174.161:5000/delete_all';

// comment
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  // tabs is an array of tab objects
  var currentTab = tabs[0];
  
  // Access the URL of the current tab
  var currentTabUrl = currentTab.url;
  
  // Now you can use currentTabUrl as needed
  document.getElementById("urlInput").value = currentTabUrl;


});
function callApi(apiEndpoint, urlParameter) {
  document.getElementById("errorImage").style.display = "none";
  const fullApiUrl = `${apiEndpoint}/generate_summary`;
  const headers = {
    'Content-Type': 'application/json',
  };
  const requestBody = JSON.stringify({ url: urlParameter });
  fetch(fullApiUrl, {
    method: 'POST',
    headers: headers,
    body: requestBody,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      if (data.Revised_summary == null) {
        document.getElementById("loadingSpinner").style.display = "none";
        document.getElementById("errorImage").style.display = "block";
        return;
      }
      new_Title(data.Revised_title);
      generateSummary(data.Revised_summary);
      createQuestion();
      document.getElementById("loadingSpinner").style.display = "none";
    })
    .catch(error => {
      document.getElementById("loadingSpinner").style.display = "none";
      document.getElementById("errorImage").style.display = "block";
      console.error('Fetch error:', error);
    });
}


var story = "In a quaint town, mysterious packages began arriving at doorsteps every Friday. No one knew the sender, yet the parcels held personalized gifts, uncannily fitting each recipient's desires. Speculation buzzed, and excitement grew with each delivery. As friendships formed over shared surprises, the once-quiet community blossomed into a tapestry of joy. Local businesses thrived, as townsfolk eagerly anticipated their weekly enchanting presents. The secret benefactor remained elusive, leaving the town enchanted in wonder. In the heart of uncertainty, the unspoken agreement was clear — the magic of the unknown had woven a tale of unity and kindness, forever altering their ordinary Fridays."
document.getElementById("openButton").addEventListener("click", function() {
  openUrl();
});

document.getElementById("openButton2").addEventListener("click", function() {
  var questionFull = document.getElementById("questionInput").value;
  sendQuestion(questionFull);

});

function openUrl() {
  var url = document.getElementById("urlInput").value;
  if (url) {
    callApi(apiEndpoint, url);
    document.getElementById("loadingSpinner").style.display = "block";
    deleteCache();
    sendUrlEmbeded(url);  
    saveUrl(url);
  }
}

function deleteCache() {
  const fullApiUrl = `${apiEndpointDelete}`;
  const headers = {
    'Content-Type': 'application/json',
  };

  fetch(fullApiUrl, {
      method: 'Post',
      headers: headers,

  })     
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('API response: succes 4', data);
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
}

function sendUrlEmbeded(url){
  const fullApiUrl = `${apiEndpoint2}`;
  const headers = {
    'Content-Type': 'application/json',
  };
  const requestBody = JSON.stringify({ url: url });
  fetch(fullApiUrl, {
    method: 'POST',
    headers: headers,
    body: requestBody,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("sucess for 2", data);
      //createAnswer(data.)
      
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

function sendQuestion(Q){
  document.getElementById("loadingSpinner").style.display = "block";
  const fullApiUrl = `${apiEndpoint3}`;
  const headers = {
    'Content-Type': 'application/json',
  };
  const requestBody = JSON.stringify({ question: Q });
  fetch(fullApiUrl, {
    method: 'POST',
    headers: headers,
    body: requestBody,
  })
    .then(response => {
      if (!response.ok) {
        document.getElementById("loadingSpinner").style.display = "none";
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      document.getElementById("loadingSpinner").style.display = "none";
      createAnswer(data.result);
      
    })
    .catch(error => {
      document.getElementById("loadingSpinner").style.display = "none";
      console.error('Fetch error:', error);
    });
}

function showURL(urlT){
  var url = document.getElementById("urlTest");
  url.textContent = urlT

}
function saveUrl(url) {
  console.log("URL saved:", url);
}
function displayUrl(url) {
  var displayedUrlElement = document.getElementById("displayedUrl");
  displayedUrlElement.textContent = "URL: " + url;
}
function new_Title(title) {
  var newTitle = document.getElementById("newTitle");
  var newTitleName = document.getElementById("newTitleName");
  newTitle.textContent = "Revised Title";
  newTitleName.textContent = title;
}
function generateSummary(summaryText){
  var summaryTitle = document.getElementById("summaryTitle");
  var summary = document.getElementById("summary");
  summaryTitle.textContent = "Summary";
  summary.textContent = summaryText;
}
function createQuestion(){
  var question = document.getElementById("questionBox");
  if (question.style.visibility=='visible') {
    question.style.visibility = 'visible';
  }
  else 
    question.style.visibility = 'visible';
}

function createAnswer(text) {
  var answer = document.getElementById("answerText");
  var answerTitle = document.getElementById("answerTitle");
  answerTitle.textContent = "Answer";
  answer.textContent = text; 
  if (answer.style.visibility=='visible') {
    answer.style.visibility = 'visible';
  }
  else 
    answer.style.visibility = 'visible';  
}