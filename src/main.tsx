import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StudyPlayer } from "../app/StudyPlayer";
import { vocabulary } from "../app/vocabulary";
import "../app/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode><StudyPlayer vocabulary={vocabulary} /></StrictMode>,
);
