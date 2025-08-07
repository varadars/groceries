const admin = require("firebase-admin");

// Avoid reinitializing the app on every call
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL:
      "https://realtime-database-8d785-default-rtdb.firebaseio.com/",
  });
}

const db = admin.database();

function today() {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekday[new Date().getDay()];
}

exports.handler = async (event) => {
  try {
    const alexaRequest = JSON.parse(event.body);
    const item =
      alexaRequest.request?.intent?.slots?.item?.value;

    if (!item) {
      throw new Error("No item provided");
    }

    const itemStruct = [item, today()];
    const refPath = db.ref("shoppingList");
    await refPath.push(itemStruct);

    return {
      statusCode: 200,
      body: JSON.stringify({
        version: "1.0",
        response: {
          outputSpeech: {
            type: "PlainText",
            text: `Got it! I've added ${item} to your grocery list.`,
          },
          shouldEndSession: true,
        },
      }),
    };
  } catch (err) {
    console.error("Error:", err);

    return {
      statusCode: 200,
      body: JSON.stringify({
        version: "1.0",
        response: {
          outputSpeech: {
            type: "PlainText",
            text: "Sorry, I couldn't add that item to your list.",
          },
          shouldEndSession: true,
        },
      }),
    };
  }
};
