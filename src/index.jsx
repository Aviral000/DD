import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const positionRoot = document.getElementById('root');
const rooting = createRoot(positionRoot);
rooting.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)