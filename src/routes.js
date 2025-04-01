import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";



export default function Router() {
  const routes = useRoutes([
    {
      path: "/",
      index: true,
      element: <Home />,
    },
    {
      path: "/history",
      element: <History/>,
    },
  ]);

  return routes;
}
