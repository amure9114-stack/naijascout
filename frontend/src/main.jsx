import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext";

createRoot(document.getElementById("root")).render(
  <PlayerProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </PlayerProvider>
);