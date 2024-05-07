import React from "react";
import "./index.css";
import {
  type StaticHandlerContext,
  StaticRouterProvider,
  createStaticRouter,
  createStaticHandler,
} from "react-router-dom/server";
import { MetaRouteObject, routes } from "./routes.tsx";
import { createFetchRequest } from "./fetch.ts";

import type * as express from "express";
import { renderToString } from "react-dom/server";

interface RenderProps {
  request: express.Request;
  response: express.Response;
}

const handler = createStaticHandler(routes);

const getMeta = (matches: StaticHandlerContext["matches"]) => {
  let matchedRoute = matches[matches.length - 1].route as MetaRouteObject;

  if (matchedRoute.index) {
    matchedRoute = matches[matches.length - 2].route as MetaRouteObject;
  }

  if (Array.isArray(matchedRoute.meta)) {
    return (
      <>
        {matchedRoute.meta.map((meta, index) => {
          return <meta key={index} {...meta} />;
        })}
      </>
    );
  }

  return matchedRoute.meta;
};

export async function render({ request, response }: RenderProps) {
  const remixRequest = createFetchRequest(request, response);
  const context = await handler.query(remixRequest);

  if (context instanceof Response) {
    throw context;
  }

  const router = createStaticRouter(
    handler.dataRoutes,
    context as StaticHandlerContext
  );

  const metaComponent = getMeta(context.matches);

  const headContent = renderToString(metaComponent);

  const html = renderToString(
    <React.StrictMode>
      <StaticRouterProvider router={router} context={context} />
    </React.StrictMode>
  );

  return { html, head: headContent };
}
