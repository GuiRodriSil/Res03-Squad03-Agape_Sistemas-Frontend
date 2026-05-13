import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./styles/index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/views/components/theme-provider.tsx"
import { TooltipProvider } from "@/views/components/ui/tooltip"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
)



