import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

// index.css also pulls in the live site's stylesheet (src/legacy/v5.css) in its own layer
import "./index.css"
import "./legacy/mockup.css"
import App from "./App.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
