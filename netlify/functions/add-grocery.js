// netlify/functions/add-grocery.js
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.handler = async (event) => {
  const { item } = JSON.parse(event.body || "{}");

  if (!item) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing item" }),
    };
  }

  await db
    .collection("groceryList")
    .add({ item, createdAt: Date.now() });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Added ${item}` }),
  };
};
