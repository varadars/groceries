import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

const firebaseConfig = {
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

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

export async function handler(event) {
  try {
    const alexaRequest = JSON.parse(event.body);
    const item =
      alexaRequest.request?.intent?.slots?.item?.value;

    if (!item) throw new Error("No item provided");

    const itemStruct = [item, today()];
    const shoppingListRef = ref(db, "shoppingList");
    await push(shoppingListRef, itemStruct);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
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
    console.error(err);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
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
}
