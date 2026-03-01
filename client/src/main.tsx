import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root")!;

// If the server rendered content into #root, hydrate it.
// Otherwise (e.g. during Vite HMR), do a full client render.
if (rootEl.innerHTML.trim().length > 0) {
  hydrateRoot(rootEl, <App />);
} else {
  createRoot(rootEl).render(<App />);
}
