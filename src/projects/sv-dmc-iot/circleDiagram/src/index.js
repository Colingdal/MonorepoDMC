/* eslint-disable no-undef */
import * as React from "react";
import { renderToString } from "react-dom/server";
import router from "@sitevision/api/common/router";
import appData from "@sitevision/api/server/appData";
import App from "./components/App";

const username = appData.get('username');
const password = appData.get('password');
const dashboardID = appData.get('dashboardID');

router.get("/", (req, res) => {
  const data = {
    username,
    password,
    dashboardID
  };
  res.agnosticRender(renderToString(<App {...data} />), data);
});
