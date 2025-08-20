import * as React from "react";
import { renderToString } from "react-dom/server";
import router from "@sitevision/api/common/router";
import App from "./components/App";
import storage from "@sitevision/api/server/storage";
import logUtil from "@sitevision/api/server/LogUtil";

const store = storage.getCollectionDataStore('dataRetrieverDDI');
const allResult = store.find('*').toArray(); 
logUtil.info(JSON.stringify(allResult));

const names = [];
allResult.forEach(item => {
  if (item.name) {
    names.push(item.name);
  }
});

logUtil.info(names);

router.get("/", (req, res) => {
const data = {
  names
}
res.agnosticRender(renderToString(<App {...data} />), data);
});
