import express from "express";
import { chromium } from "playwright";

const app = express();
const PORT = process.env.PORT || 3000;

// Serve home page with an iframe UI
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Playwright Proxy Viewer</title>
      </head>
      <body>
        <h2>🌐 Proxy Viewer</h2>
        <form onsubmit="go(event)">
          <input id="url" placeholder="https://google.com" style="width:70%">
          <button>Go</button>
        </form>
        <iframe id="frame" style="width:100%; height:80vh; border:1px solid #ccc;"></iframe>
        <script>
          function go(e) {
            e.preventDefault();
            const target = document.getElementById("url").value;
            document.getElementById("frame").src = '/proxy?url=' + encodeURIComponent(target);
          }
        </script>
      </body>
    </html>
  `);
});

// Proxy route — fetches fully rendered HTML via headless Chromium
app.get("/proxy", async (req, res) => {
  const url = req.query.url;
  if (!url || !/^https?:\/\//i.test(url))
    return res.status(400).send("Invalid URL");

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
      ],
    });

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle" });

    const html = await page.content();
    res.set("content-type", "text/html");
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err.message);
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
