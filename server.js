import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const TARGET = "https://mvpatm.pro";

app.get("*", async (req, res) => {
  const targetUrl = TARGET + req.path + (req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "");
  console.log("➡️ Proxying:", targetUrl);

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Upgrade-Insecure-Requests": "1",
        "Referer": TARGET,
        "Connection": "keep-alive"
      },
      redirect: "follow"
    });

    const contentType = response.headers.get("content-type") || "text/html";
    const body = await response.text();
    res.set("content-type", contentType);
    res.status(response.status).send(body);
  } catch (err) {
    res.status(500).send(`<h2>Proxy Error:</h2><p>${err.message}</p>`);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("✅ ATM Proxy running on port", port));
