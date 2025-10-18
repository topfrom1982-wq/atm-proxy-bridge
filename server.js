import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.text({ limit: "10mb" }));

const TARGET = "https://mvpatm.pro";

app.get("*", async (req, res) => {
  const url = TARGET + req.path + (req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "");
  console.log("➡️ Fetch:", url);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept-Language": "en-US,en;q=0.9",
      }
    });

    const body = await response.text();
    res.set("content-type", response.headers.get("content-type") || "text/html");
    res.status(response.status).send(body);

  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("✅ ATM Proxy running on port", port));
