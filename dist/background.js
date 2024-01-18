/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    const extractData = (query) => __awaiter(this, void 0, void 0, function* () {
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
        const response = yield fetch(url);
        const html = yield response.text();
        // const $ = cheerio.load(html);
        // const aTags = $("a");
        // const parents = [];
        // aTags.each((i, el) => {
        //   const href = $(el).attr("href");
        //   if (!href) {
        //     return;
        //   }
        //   if (href.includes("/maps/place/")) {
        //     parents.push($(el).parent());
        //   }
        // });
        // console.log("parents", parents.length);
    });
});


/******/ })()
;
//# sourceMappingURL=background.js.map