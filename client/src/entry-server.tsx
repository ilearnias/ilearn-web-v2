import { renderToString } from "react-dom/server";
import { Helmet } from "react-helmet";
import App from "./App";

export function render(url: string) {
  const html = renderToString(<App ssrPath={url} />);
  const helmet = Helmet.renderStatic();

  return {
    html,
    head:
      helmet.title.toString() +
      helmet.meta.toString() +
      helmet.link.toString() +
      helmet.script.toString(),
  };
}
