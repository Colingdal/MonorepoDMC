import * as React from "react";
import { renderToString } from "react-dom/server";
import router from "@sitevision/api/common/router";
import App from "./components/App";

router.get("/", (req, res) => {
  const data = {}
  res.agnosticRender(renderToString(<App {...data} />), data);
});
// const username = 'restuser'; 
// const password = '8pzpmf'; 