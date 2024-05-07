import axios from "axios";
import { IndexRouteObject, NonIndexRouteObject, json } from "react-router-dom";
import { Home } from "./Home";

type MetaAttributes = "name" | "http-equiv" | "charset" | "itemprop";

type Meta = { title: string } | Partial<Record<MetaAttributes, string>>;

export type MetaRouteObject =
  | (IndexRouteObject & { meta?: React.ReactNode | Meta[] })
  | (NonIndexRouteObject & {
      meta?: React.ReactNode | Meta[];
      children?: MetaRouteObject[];
    });

const strapiService = axios.create({ baseURL: "http://127.0.0.1:1337/api" });

export const routes: MetaRouteObject[] = [
  {
    path: "/",
    element: <Home />,
    loader: async () => {
      const foodList = (
        await strapiService.get<StrapiResponse<Food[]>>("/foods")
      ).data;

      return json(foodList.data ?? []);
    },
    meta: (
      <>
        <title>Home</title>
        <meta name="title" content="Vite Server | Home" />
      </>
    ),
    children: [
      {
        path: "home",
        element: (
          <p>
            Nested Screen, rendered on <kbd>/home</kbd>
          </p>
        ),
        meta: (
          <>
            <title>Nested Home</title>
            <meta name="title" content="Vite Server" />
          </>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <p>404, wrong Landing</p>,
    meta: [{ title: "Hello" }, { name: "Hello" }],
  },
];
