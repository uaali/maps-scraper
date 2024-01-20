/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/contentScript/contentScript.ts":
/*!********************************************!*\
  !*** ./src/contentScript/contentScript.ts ***!
  \********************************************/
/***/ (function() {

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
console.log("contentScript.ts loaded");
// Listen for messages
//get tab id
const url = window.location.href;
const urlSplit = url.split("/");
const tabId = urlSplit[urlSplit.length - 1];
console.log("tabId", tabId);
const closeTab = () => __awaiter(this, void 0, void 0, function* () {
    let d = yield scraper();
    let port = chrome.runtime.connect({ name: "content" });
    port.postMessage({ msg: "close", d });
});
const scraper = () => __awaiter(this, void 0, void 0, function* () {
    let data = [];
    if (window.location.href.startsWith("https://www.google.com/maps/")) {
        function autoScroll() {
            return __awaiter(this, void 0, void 0, function* () {
                const wrapper = document.querySelector('div[role="feed"]');
                if (!wrapper)
                    return;
                yield new Promise((resolve) => {
                    var totalHeight = 0;
                    var distance = 1000;
                    var scrollDelay = 3000;
                    var timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                        var scrollHeightBefore = wrapper.scrollHeight;
                        wrapper.scrollBy(0, distance);
                        totalHeight += distance;
                        if (totalHeight >= scrollHeightBefore) {
                            totalHeight = 0;
                            yield new Promise((resolve) => setTimeout(resolve, scrollDelay));
                            // Calculate scrollHeight after waiting
                            var scrollHeightAfter = wrapper.scrollHeight;
                            if (scrollHeightAfter > scrollHeightBefore) {
                                // More content loaded, keep scrolling
                                return;
                            }
                            else {
                                // No more content loaded, stop scrolling
                                clearInterval(timer);
                                resolve();
                            }
                        }
                    }), 200);
                });
            });
        }
        // Call the function
        yield autoScroll();
        let aTags = document.getElementsByTagName("a");
        const parents = [];
        for (let i = 0; i < aTags.length; i++) {
            let href = aTags[i].getAttribute("href");
            if (href && href.includes("/maps/place/")) {
                parents.push(aTags[i].parentElement);
            }
        }
        parents.forEach((parent) => {
            const urlElement = parent.querySelector("a");
            const url = urlElement ? urlElement.getAttribute("href") : null;
            const websiteElement = parent.querySelector('a[data-value="Website"]');
            const website = websiteElement
                ? websiteElement.getAttribute("href")
                : null;
            const storeNameElement = parent.querySelector("div.fontHeadlineSmall");
            const storeName = storeNameElement ? storeNameElement.textContent : null;
            const ratingTextElement = parent.querySelector("span.fontBodyMedium > span" || 0);
            const ratingText = ratingTextElement
                ? ratingTextElement.getAttribute("aria-label")
                : null;
            const parentElement = parent; // Cast to HTMLElement
            const bodyDiv = parentElement.querySelector("div.fontBodyMedium");
            const children = bodyDiv ? Array.from(bodyDiv.children) : [];
            const lastChild = children.length > 0 ? children[children.length - 1] : null;
            const firstOfLast = lastChild ? lastChild.children[0] : null;
            const lastOfLast = lastChild
                ? lastChild.children[lastChild.children.length - 1]
                : null;
            let phoneNumber = "";
            // Check if there are any children
            if (children.length > 0) {
                const lastChild = children[children.length - 1];
                // Check if there is a last child element
                if (lastChild) {
                    const lastChildSpans = Array.from(lastChild.querySelectorAll("span"));
                    // Assuming the phone number is in the last 'span' element within the last child
                    const phoneElement = lastChildSpans.length > 0
                        ? lastChildSpans[lastChildSpans.length - 1]
                        : null;
                    // Check if the phone element exists before extracting the phone number
                    phoneNumber = phoneElement ? phoneElement.textContent.trim() : "";
                }
            }
            const digitCount = (phoneNumber.match(/\d/g) || []).length;
            // Check if the phone number contains at least 10 digits
            if (digitCount < 10) {
                phoneNumber = "";
            }
            const latRegex = /!3d(-?\d+\.\d+)/;
            const lonRegex = /!4d(-?\d+\.\d+)/;
            // Extract latitude and longitude using regular expressions
            const latitude = parseFloat(url.match(latRegex)[1]);
            const longitude = parseFloat(url.match(lonRegex)[1]);
            let business = {
                latitude,
                longitude,
                placeId: "ChI" + (url ? url.split("?")[0].split("ChI")[1] : ""),
                address: firstOfLast
                    ? (firstOfLast.textContent.split("·")[1] || "").trim()
                    : "",
                category: firstOfLast
                    ? firstOfLast.textContent.split("·")[0].trim()
                    : "",
                phone: phoneNumber || "",
                googleUrl: url || "",
                bizWebsite: website || "",
                storeName: storeName || "",
                ratingText: ratingText || "",
                stars: ratingText && ratingText.split("stars")[0].trim()
                    ? Number(ratingText.split("stars")[0].trim())
                    : null,
                numberOfReviews: ratingText && ratingText.split("stars")[1]
                    ? Number(ratingText.split("stars")[1].replace("Reviews", "").trim())
                    : null,
            };
            data.push(business);
        });
    }
    return data;
});
closeTab();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/contentScript/contentScript.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=contentScript.js.map