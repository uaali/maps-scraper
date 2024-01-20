let queries = [];
let results = [];
let currentQueryIndex = 0;
import { parse } from 'json2csv';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const keywords = request.msg.keywords;
  const locations = request.msg.locations;
  keywords.forEach((keyword) => {
    locations.forEach((location) => {
      queries.push(keyword + " " + location);
    });
  });

  scrapeNextQuery();
  const generalTransform = (value) => (value === null ? '""' : value);

  // Convert JSON to CSV with a general transform
  const csvData = parse(results, { transforms: [generalTransform] });

  // Create a Blob and download link
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  let href = URL.createObjectURL(blob);
  console.log("href", href);
});

function scrapeNextQuery() {
  if (currentQueryIndex < queries.length) {
    const query = queries[currentQueryIndex];
    scrapeData(query);
    currentQueryIndex++;
  }
}

async function scrapeData(query) {
  const url = `https://www.google.com/maps/search/${query
    .split(" ")
    .join("+")}`;
  chrome.tabs.create({ url }, async (tab) => {
    chrome.runtime.onConnect.addListener(async function (port) {
      console.assert(port.name === "content");
      await port.onMessage.addListener(function (msg) {
        if (msg.msg === "close") {
          chrome.tabs.get(tab.id, function (tabInfo) {
            if (chrome.runtime.lastError || !tabInfo) {
              // Tab doesn't exist or there was an error
              console.error(
                "Error getting tab info:",
                chrome.runtime.lastError
              );
            } else {
              chrome.tabs.remove(tab.id, function () {
                results.push(msg);
                scrapeNextQuery();
              });
            }
          });
        }
      });
    });
    await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      files: ["contentScript.js"],
    });
  });
}
