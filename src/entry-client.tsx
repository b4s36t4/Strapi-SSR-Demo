import React from "react";
import "./index.css";
import { hydrateRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./routes.tsx";

const router = createBrowserRouter(routes);

hydrateRoot(
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  document.getElementById("root")!,
  <React.StrictMode>
    <RouterProvider router={router} fallbackElement={null} />
  </React.StrictMode>
);
