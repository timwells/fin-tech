const config = require("./config.json");
const functions = require("firebase-functions");
const scrapeIt = require("scrape-it");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.status(200).send(JSON.stringify({hello: "Hello from Firebase!"}));
});

exports.pricefeed = functions.https.onRequest((request, response) => {
  const apiKey = request.get("x-api-key");

  if (apiKey === config.RICE_FEED_API_KEY) {
    const _path = request.query.path;
    const _type = request.query.type;
    console.log("path:", _path);
    console.log("type:", _type);

    scrapeIt(`https://www.hl.co.uk/${_path}`, {
    // scrapeIt(`https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/${_fund}`, {
      prices: {
        listItem: `${_type}`,
      },
    },
    (err, {data}) => {
      const res = {
        fund: `${_path}`,
        type: `${_type}`,
        // price: parseFloat(`${data.prices[0].split("p")[0]}`),
        price: parseFloat(`${data.prices[0].replace(",", "").split("p")[0]}`),
        time: new Date().toLocaleString(),
      };
      response.status(200).send(JSON.stringify(res));
    });
  } else {
    response.status(404).send("Invalid Api-Key");
  }
});
