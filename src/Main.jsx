import { createRoot } from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";

import "./styles/index.css";

import Index from "./pages/Index";

createRoot(document.getElementById("root")).render(
        <Router>
            <Index />
        </Router>
);
