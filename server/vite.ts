import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

/**
 * Inject SSR-rendered HTML and Helmet head tags into the template.
 */
function injectSSRContent(
  template: string,
  appHtml: string,
  headTags: string
): string {
  // Replace the SSR outlet placeholder with rendered React HTML
  let html = template.replace("<!--ssr-outlet-->", appHtml);
  // Replace the Helmet head placeholder with rendered head tags
  html = html.replace("<!--helmet-head-->", headTags);
  return html;
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: {
      ...serverOptions,
      allowedHosts: [
        "ilearn.bairuhatech.com",
        "localhost",
        "127.0.0.1",
        ".bairuhatech.com",
      ],
      host: "0.0.0.0",
    },
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk in case it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      template = await vite.transformIndexHtml(url, template);

      // SSR: load the entry-server module and render the app
      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
      const { html: appHtml, head: headTags } = render(url);

      const html = injectSSRContent(template, appHtml, headTags);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "..", "dist", "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // SSR: import the pre-built server entry and render on each request
  const ssrEntryPath = path.resolve(__dirname, "..", "dist", "server", "entry-server.js");

  // fall through to SSR if the file doesn't exist as a static asset
  app.use("*", async (req, res, next) => {
    try {
      const templatePath = path.resolve(distPath, "index.html");
      const template = await fs.promises.readFile(templatePath, "utf-8");

      const { render } = await import(ssrEntryPath);
      const { html: appHtml, head: headTags } = render(req.originalUrl);

      const html = injectSSRContent(template, appHtml, headTags);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      next(e);
    }
  });
}
