import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);

root.render(<App />);

// Enable hot module replacement for development
if (import.meta.hot) {
  import.meta.hot.accept();
}
