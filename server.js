import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";
import process from "node:process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

/**
 * @type {string}
 */
let template;

/**
 * @type {import("vite").ViteDevServer | null}
 */
let vite;

const isProduction = process.env.NODE_ENV === "production";

const app = express();

async function loadTemplate() {
  if (isProduction) {
    template = fs.readFileSync(
      path.resolve(__dirname, "dist/client/index.html"),
      "utf-8"
    );

    const compression = (await import("compression")).default;
    const sirv = (await import("sirv")).default;
    app.use(compression());
    app.use(base, sirv("./dist/client", { extensions: [] }));
  } else {
    vite = await createViteServer({
      appType: "custom",
      server: { middlewareMode: true },
    });

    app.use(vite.middlewares);
    template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
  }

  return vite;
}

const startServer = async () => {
  await loadTemplate();

  app.use("*", async (req, res) => {
    let render, templateHTML;
    if (isProduction) {
      render = (await import("./dist/server/entry-server.js")).render;
      templateHTML = template;
    } else {
      templateHTML = await vite.transformIndexHtml(req.originalUrl, template);
      render = (await vite.ssrLoadModule("./src/entry-server.tsx")).render;
    }

    const { html: appHtml, head } = await render({
      request: req,
      response: res,
    });

    // 5. Inject the app-rendered HTML into the template.
    let html = templateHTML.replace(`<!--ssr-outlet-->`, appHtml);
    html = html.replace(
      "<!--meta-outlet-->",
      head ?? "<title>React SSR App </title>"
    );

    // 6. Send the rendered HTML back.
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  });

  app.listen(port);

  console.log(`Checkout: http://localhost:${port}`);
};

startServer();
