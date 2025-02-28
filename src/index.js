import React from "react";
import ReactDOM from "react-dom/client"; // Use React 18's `react-dom/client`
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")); // Use `createRoot`

root.render(
    <React.StrictMode>
        <DndProvider backend={HTML5Backend}>
            <App />
        </DndProvider>
    </React.StrictMode>
);
