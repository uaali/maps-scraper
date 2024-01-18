import * as cheerio from "cheerio";

chrome.runtime.onInstalled.addListener(function (details) {
  console.log("Background script loaded.");

  const scrapeData = (keywords, locations) => {
    let queries = [];
    keywords.forEach((keyword) => {
      locations.forEach((location) => {
        queries.push(`${keyword} ${location}`);
      });
    });
    queries.forEach((query) => {
      extractData(query);
    });
  };
  const extractData = async (query) => {
    let companyName;
    let category;
    let websiteURL = [];
    let phoneNumber;
    let email = [];
    let latitude;
    let longitude;
    let address;
    let city;
    let state;
    let pinCode;
    let ratingCount;
    let review;
    let googleMapLink;

    let url = `https://www.google.com/maps/search/${query
      .split(" ")
      .join("+")}`;
    googleMapLink = url;

    const response = await fetch(url);

    const html = await response.text();

    const $ = cheerio.load(html);
    const aTags = $("a");
    const parents = [];
    aTags.each((i, el) => {
      const href = $(el).attr("href");
      if (!href) {
        return;
      }
      if (href.includes("/maps/place/")) {
        parents.push($(el).parent());
      }
    });
    console.log("parents", parents.length);
  };
});
