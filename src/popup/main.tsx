import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./main.css";

// biome-ignore lint/style/noNonNullAssertion:
createRoot(document.getElementById("root")!).render(<App />);
