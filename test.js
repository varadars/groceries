import fetch from "node-fetch";

async function test() {
  const res = await fetch(
    "http://localhost:8888/.netlify/functions/add-grocery",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        request: {
          intent: {
            slots: {
              item: { value: "bananas" },
            },
          },
        },
      }),
    }
  );
  const json = await res.json();
  console.log(json);
}

test();
